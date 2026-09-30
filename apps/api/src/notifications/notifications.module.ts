import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PushToken } from "./entities/push-token.entity";
import { PushController } from "./push.controller";
import { PushService } from "./push.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([PushToken]), UsersModule],
    controllers: [PushController],
    providers: [PushService],
    exports: [PushService],
})
export class NotificationsModule {}
