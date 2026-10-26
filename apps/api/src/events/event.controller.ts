import { Body, Controller, Delete, Get, HttpCode, Logger, Param, ParseIntPipe, Post, Request } from "@nestjs/common";
import { EventsService, EventResponse } from "./event.service";
import { CreateEventDto } from "./entities/create-event.dto";
import { FarmScoped } from "../auth/farm-scoped.decorator";
import { AuthUserPayload } from "../auth/auth-user.payload";

@FarmScoped()
@Controller('events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(private readonly eventsService: EventsService) {}

    @Get()
    async findAll(@Request() req: { user: AuthUserPayload }): Promise<EventResponse[]> {
        const farmId = req.user.farmId!;
        this.logger.log(`Fetching events for farm ${farmId}`);
        return this.eventsService.findByFarm(farmId);
    }

    @Post()
    async create(
        @Body() createEventDto: CreateEventDto,
        @Request() req: { user: AuthUserPayload },
    ): Promise<EventResponse> {
        const farmId = req.user.farmId!;
        this.logger.log(`Creating event "${createEventDto.title}" for farm ${farmId}`);
        return this.eventsService.create(createEventDto, farmId, req.user.userId);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: AuthUserPayload },
    ): Promise<void> {
        const farmId = req.user.farmId!;
        this.logger.log(`Deleting event ${id} for farm ${farmId}`);
        await this.eventsService.delete(id, farmId, req.user.userId);
    }
}
