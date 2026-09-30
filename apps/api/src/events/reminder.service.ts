import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { CalendarEvent } from "./entities/event.entity";
import { PushService } from "../notifications/push.service";

// How long before an event a reminder fires, and at what time of day.
const REMINDER_DAYS_BEFORE = 7;
const REMINDER_HOUR = 8;
// How often the scheduler scans for due reminders. 15 minutes bounds how late a
// reminder can be relative to REMINDER_HOUR without spamming the database.
const SCAN_INTERVAL_MS = 15 * 60 * 1000;

@Injectable()
export class ReminderService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ReminderService.name);
    private timer?: ReturnType<typeof setInterval>;

    constructor(
        @InjectRepository(CalendarEvent) private readonly eventRepository: Repository<CalendarEvent>,
        private readonly pushService: PushService,
    ) {}

    onModuleInit() {
        this.timer = setInterval(() => {
            this.sendDueReminders().catch((err) => this.logger.error(err));
        }, SCAN_INTERVAL_MS);
        // Also run once shortly after boot.
        this.sendDueReminders().catch((err) => this.logger.error(err));
    }

    onModuleDestroy() {
        if (this.timer) clearInterval(this.timer);
    }

    // The moment a reminder should fire: REMINDER_DAYS_BEFORE days before the
    // event date, at REMINDER_HOUR local server time.
    private reminderMoment(dateStr: string): Date {
        const d = new Date(`${dateStr}T00:00:00`);
        d.setDate(d.getDate() - REMINDER_DAYS_BEFORE);
        d.setHours(REMINDER_HOUR, 0, 0, 0);
        return d;
    }

    async sendDueReminders(): Promise<void> {
        const now = new Date();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const pending = await this.eventRepository.find({
            where: { reminderSentAt: IsNull() },
            relations: ['animal'],
        });

        for (const event of pending) {
            const eventDate = new Date(`${event.date}T00:00:00`);

            // Past events never get a reminder; mark handled so we stop scanning them.
            if (eventDate.getTime() < startOfToday.getTime()) {
                event.reminderSentAt = now;
                await this.eventRepository.save(event);
                continue;
            }

            // Not due yet.
            if (this.reminderMoment(event.date).getTime() > now.getTime()) continue;

            const animalSuffix = event.animal ? ` – ${event.animal.name}` : "";
            await this.pushService.sendToFarm(event.farmId, {
                title: "Opomnik na opravilo",
                body: `${event.title}${animalSuffix} · ${event.date}`,
                data: { type: "event.reminder", eventId: event.id },
            });

            event.reminderSentAt = now;
            await this.eventRepository.save(event);
            this.logger.log(`Sent reminder for event ${event.id} (farm ${event.farmId})`);
        }
    }
}
