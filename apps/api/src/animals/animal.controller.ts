import { Body, Controller, Get, Logger, NotFoundException, Post, Request } from "@nestjs/common";
import { AnimalsService } from "./animal.service";
import { CreateAnimalDto } from "./entities/create-animal.dto";
import { Animal } from "./entities/animal.entity";

@Controller('animals')
export class AnimalsController {
    private readonly logger = new Logger(AnimalsController.name);

    constructor(private readonly animalsService: AnimalsService) {}

    //
    @Get()
    async findAll(@Request() req) {
        this.logger.log('Fetching animals');
        try {
            if(!req.animal?.animalId) {
                this.logger.error('No Animal was found in request');
                throw new NotFoundException('Animal ID not found in request');
            }

            this.logger.log('Fetching animal: ', req.animal.animalId);
            const animal = await this.animalsService.findById(req.animal.animalId);
            this.logger.log(req);

        } catch (error) {
            this.logger.error('Error fetching animals: ', error);
            throw error;
        }
    }

    @Post()
    async create(@Body() createAnimalDto: CreateAnimalDto,
    @Request() req): Promise<Animal> {
        try {
            const animal = await this.animalsService.create(createAnimalDto, req.farm.birthFarmId);
            this.logger.log('Creating animal: ', animal);
            return animal;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}