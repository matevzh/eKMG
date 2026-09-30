import { TypeOrmModule } from "@nestjs/typeorm";
import { Animal } from "./entities/animal.entity";
import { AnimalsController } from "./animal.controller";
import { AnimalsService } from "./animal.service";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { FarmsModule } from "../farms/farm.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([Animal]), FarmsModule, UsersModule],
    controllers: [AnimalsController],
    providers: [AnimalsService],
    exports: [AnimalsService]
})

export class AnimalsModule {}