import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { CalendarEvent } from "./entities/event.entity";
import { PushService } from "../notifications/push.service";

// The reminders fired before an event, in days. Each is tracked independently
// on the event so neither is ever sent twice. Keep this in sync with the
// client-side labels in the mobile calendar screen.
const REMINDER_OFFSETS: { days: number; column: 'reminderWeekSentAt' | 'reminderDaySentAt' }[] = [
    { days: 7, column: 'reminderWeekSentAt' },
    { days: 1, column: 'reminderDaySentAt' },
];

// At what time of day (local server time) a reminder fires.
const REMINDER_HOUR = 8;
// How often the scheduler scans for due reminders. 15 minutes bounds how late a
// reminder can be relative to REMINDER_HOUR without spamming the database.
const SCAN_INTERVAL_MS = 15 * 60 * 1000;
// A reminder whose moment is already further in the past than this is marked
// handled without sending. This stops a long-overdue slot from firing — e.g.
// the "week before" reminder for an event created only three days out, or a
// backlog built up while the server was down — while still tolerating normal
// downtime and the scan cadence.
const REMINDER_GRACE_MS = 12 * 60 * 60 * 1000;

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

    // The moment a reminder should fire: `daysBefore` days before the event
    // date, at REMINDER_HOUR local server time.
    private reminderMoment(dateStr: string, daysBefore: number): Date {
        const d = new Date(`${dateStr}T00:00:00`);
        d.setDate(d.getDate() - daysBefore);
        d.setHours(REMINDER_HOUR, 0, 0, 0);
        return d;
    }

    async sendDueReminders(): Promise<void> {
        const now = new Date();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Events still missing at least one reminder (OR across the two slots).
        const pending = await this.eventRepository.find({
            where: [{ reminderWeekSentAt: IsNull() }, { reminderDaySentAt: IsNull() }],
            relations: ['animal'],
        });

        for (const event of pending) {
            const eventDate = new Date(`${event.date}T00:00:00`);

            // Past events never get a reminder; mark every slot handled so we stop scanning them.
            if (eventDate.getTime() < startOfToday.getTime()) {
                for (const { column } of REMINDER_OFFSETS) {
                    if (event[column] == null) event[column] = now;
                }
                await this.eventRepository.save(event);
                continue;
            }

            let changed = false;
            for (const { days, column } of REMINDER_OFFSETS) {
                if (event[column] != null) continue; // already handled

                const moment = this.reminderMoment(event.date, days);
                if (moment.getTime() > now.getTime()) continue; // not due yet

                const overdueMs = now.getTime() - moment.getTime();
                if (overdueMs <= REMINDER_GRACE_MS) {
                    const animalSuffix = event.animal ? ` – ${event.animal.name}` : "";
                    await this.pushService.sendToFarm(event.farmId, {
                        title: "Opomnik na opravilo",
                        body: `${event.title}${animalSuffix} · ${event.date}`,
                        data: { type: "event.reminder", eventId: event.id, daysBefore: days },
                    });
                    this.logger.log(`Sent ${days}-day reminder for event ${event.id} (farm ${event.farmId})`);
                }

                // Mark handled whether we sent it or skipped it as overdue.
                event[column] = now;
                changed = true;
            }

            if (changed) await this.eventRepository.save(event);
        }
    }
}
