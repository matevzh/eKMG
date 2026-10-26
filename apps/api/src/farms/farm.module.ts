import { TypeOrmModule } from "@nestjs/typeorm";
import { Farm } from "./entities/farm.entity";
import { Module } from "@nestjs/common";
import { FarmsController } from "./farm.controller";
import { FarmService } from "./farm.service";

@Module({
    imports: [TypeOrmModule.forFeature([Farm])],
    controllers: [FarmsController],
    providers: [FarmService],
    exports: [FarmService]
})

export class FarmsModule {}