import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Post, Request, UseGuards } from "@nestjs/common";
import { EventsService, EventResponse } from "./event.service";
import { CreateEventDto } from "./entities/create-event.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "../users/user.service";

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name);

    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
    ) {}

    private async resolveFarmId(req): Promise<number> {
        const user = await this.usersService.findById(req.user.userId);
        if (!user.farm) {
            throw new NotFoundException('User is not linked to a farm');
        }
        return user.farm.id;
    }

    @Get()
    async findAll(@Request() req): Promise<EventResponse[]> {
        const farmId = await this.resolveFarmId(req);
        this.logger.log(`Fetching events for farm ${farmId}`);
        return this.eventsService.findByFarm(farmId);
    }

    @Post()
    async create(@Body() createEventDto: CreateEventDto, @Request() req): Promise<EventResponse> {
        const farmId = await this.resolveFarmId(req);
        this.logger.log(`Creating event "${createEventDto.title}" for farm ${farmId}`);
        return this.eventsService.create(createEventDto, farmId, req.user.userId);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
        const farmId = await this.resolveFarmId(req);
        this.logger.log(`Deleting event ${id} for farm ${farmId}`);
        await this.eventsService.delete(id, farmId, req.user.userId);
    }
}
