import { Body, Controller, Delete, Get, HttpCode, Logger, Param, ParseIntPipe, Patch, Post, Request } from "@nestjs/common";
import { AnimalsService } from "./animal.service";
import { CreateAnimalDto } from "./entities/create-animal.dto";
import { UpdateAnimalDto } from "./entities/update-animal.dto";
import { Animal } from "./entities/animal.entity";
import { FarmScoped } from "../auth/farm-scoped.decorator";
import { AuthUserPayload } from "../auth/auth-user.payload";

@FarmScoped()
@Controller('animals')
export class AnimalsController {
    private readonly logger = new Logger(AnimalsController.name);

    constructor(private readonly animalsService: AnimalsService) {}

    @Get()
    async findAll(@Request() req: { user: AuthUserPayload }): Promise<Animal[]> {
        const farmId = req.user.farmId!;
        this.logger.log(`Fetching animals for farm ${farmId}`);
        return this.animalsService.findByFarm(farmId);
    }

    @Post()
    async create(
        @Body() createAnimalDto: CreateAnimalDto,
        @Request() req: { user: AuthUserPayload },
    ): Promise<Animal> {
        const farmId = req.user.farmId!;
        this.logger.log(`Creating animal ${createAnimalDto.si_id} for farm ${farmId}`);
        return this.animalsService.create(createAnimalDto, farmId);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAnimalDto: UpdateAnimalDto,
        @Request() req: { user: AuthUserPayload },
    ): Promise<Animal> {
        const farmId = req.user.farmId!;
        this.logger.log(`Updating animal ${id} for farm ${farmId}`);
        return this.animalsService.update(id, updateAnimalDto, farmId);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: { user: AuthUserPayload },
    ): Promise<void> {
        const farmId = req.user.farmId!;
        this.logger.log(`Deleting animal ${id} for farm ${farmId}`);
        await this.animalsService.delete(id, farmId);
    }
}
