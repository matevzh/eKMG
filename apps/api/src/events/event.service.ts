import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CalendarEvent } from "./entities/event.entity";
import { CreateEventDto } from "./entities/create-event.dto";
import { AnimalsService } from "../animals/animal.service";
import { PushService } from "../notifications/push.service";

// Shape returned to clients: the event plus flattened animal name/tag for display.
export interface EventResponse {
    id: number;
    title: string;
    note: string | null;
    date: string;
    notificationId: string | null;
    reminderSent: boolean;
    animalId: number | null;
    animalName: string | null;
    animalSiId: string | null;
}

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        @InjectRepository(CalendarEvent) private readonly eventRepository: Repository<CalendarEvent>,
        private readonly animalsService: AnimalsService,
        private readonly pushService: PushService,
    ) {}

    private toResponse(event: CalendarEvent): EventResponse {
        return {
            id: event.id,
            title: event.title,
            note: event.note ?? null,
            date: event.date,
            notificationId: event.notificationId ?? null,
            reminderSent: event.reminderDaySentAt != null,
            animalId: event.animalId ?? null,
            animalName: event.animal?.name ?? null,
            animalSiId: event.animal?.si_id ?? null,
        };
    }

    async findByFarm(farmId: number): Promise<EventResponse[]> {
        const events = await this.eventRepository.find({
            where: { farmId },
            relations: ['animal'],
            order: { date: 'ASC' },
        });
        return events.map((e) => this.toResponse(e));
    }

    async create(dto: CreateEventDto, farmId: number, userId: number): Promise<EventResponse> {
        // Idempotent create: if this device already POSTed the same clientId, return it.
        if (dto.clientId) {
            const existing = await this.eventRepository.findOne({
                where: { farmId, clientId: dto.clientId },
                relations: ['animal'],
            });
            if (existing) return this.toResponse(existing);
        }

        let animalId: number | null = null;
        if (dto.animalId != null) {
            const animal = await this.animalsService.findById(dto.animalId);
            if (!animal || animal.birthFarmId !== farmId)
                throw new NotFoundException('Animal not found');
            animalId = animal.id;
        }

        const event = this.eventRepository.create({
            title: dto.title,
            note: dto.note,
            date: dto.date,
            notificationId: dto.notificationId ?? null,
            clientId: dto.clientId ?? null,
            animalId,
            farmId,
        });
        const saved = await this.eventRepository.save(event);

        // Reload with the animal relation so the response carries the animal name/tag.
        const full = await this.eventRepository.findOne({
            where: { id: saved.id },
            relations: ['animal'],
        });
        const response = this.toResponse(full ?? saved);

        // Live sync: notify the farm's other devices about the new event.
        const animalSuffix = response.animalName ? ` – ${response.animalName}` : "";
        void this.pushService.sendToFarm(
            farmId,
            {
                title: "Novo opravilo",
                body: `${response.title}${animalSuffix} · ${response.date}`,
                data: { type: "event.created", eventId: response.id },
            },
            userId,
        );

        return response;
    }

    async delete(id: number, farmId: number, userId: number): Promise<void> {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event || event.farmId !== farmId)
            throw new NotFoundException('Event not found');

        await this.eventRepository.delete(id);

        // Live sync: notify the farm's other devices that the event is gone.
        void this.pushService.sendToFarm(
            farmId,
            {
                title: "Opravilo izbrisano",
                body: `${event.title} · ${event.date}`,
                data: { type: "event.deleted", eventId: id },
            },
            userId,
        );
    }
}
