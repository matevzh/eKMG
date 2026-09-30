import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { AnimalsService } from "./animal.service";
import { CreateAnimalDto } from "./entities/create-animal.dto";
import { UpdateAnimalDto } from "./entities/update-animal.dto";
import { Animal } from "./entities/animal.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "../users/user.service";

@UseGuards(JwtAuthGuard)
@Controller('animals')
export class AnimalsController {
    private readonly logger = new Logger(AnimalsController.name);

    constructor(
        private readonly animalsService: AnimalsService,
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
    async findAll(@Request() req): Promise<Animal[]> {
        const farmId = await this.resolveFarmId(req);
        this.logger.log(`Fetching animals for farm ${farmId}`);
        return this.animalsService.findByFarm(farmId);
    }

    @Post()
    async create(@Body() createAnimalDto: CreateAnimalDto, @Request() req): Promise<Animal> {
        const farmId = await this.resolveFarmId(req);
        this.logger.log(`Creating animal ${createAnimalDto.si_id} for farm ${farmId}`);
        return this.animalsService.create(createAnimalDto, farmId);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAnimalDto: UpdateAnimalDto,
        @Request() req,
    ): Promise<Animal> {
        const farmId = await this.resolveFarmId(req);
        this.logger.log(`Updating animal ${id} for farm ${farmId}`);
        return this.animalsService.update(id, updateAnimalDto, farmId);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
        const farmId = await this.resolveFarmId(req);
        this.logger.log(`Deleting animal ${id} for farm ${farmId}`);
        await this.animalsService.delete(id, farmId);
    }
}
