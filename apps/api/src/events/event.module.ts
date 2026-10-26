import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CalendarEvent } from "./entities/event.entity";
import { EventsController } from "./event.controller";
import { EventsService } from "./event.service";
import { ReminderService } from "./reminder.service";
import { AnimalsModule } from "../animals/animal.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
    imports: [TypeOrmModule.forFeature([CalendarEvent]), AnimalsModule, NotificationsModule],
    controllers: [EventsController],
    providers: [EventsService, ReminderService],
    exports: [EventsService],
})
export class EventsModule {}
