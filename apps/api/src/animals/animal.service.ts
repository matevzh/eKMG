import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Animal } from "./entities/animal.entity";
import { CreateAnimalDto } from "./entities/create-animal.dto";
import { UpdateAnimalDto } from "./entities/update-animal.dto";
import { FarmService } from "../farms/farm.service";

@Injectable()
export class AnimalsService {

    constructor(
        @InjectRepository(Animal) private readonly animalRepository: Repository<Animal>,
        private readonly farmService: FarmService
    ) {}

    async findAll(): Promise<Animal[]> {
        return await this.animalRepository.find();
    }

    async findByFarm(farmId: number): Promise<Animal[]> {
        return await this.animalRepository.find({
            where: { birthFarmId: farmId },
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: number): Promise<Animal | null> {
        if(!id) {
            throw new NotFoundException('Animal ID is required');
        }
        return await this.animalRepository.findOne({
            where: { id }
        });
    }


    async create(animal: CreateAnimalDto, birthFarmId: number): Promise<Animal> {
        const birthfarm = await this.farmService.findById(birthFarmId);
        if(!birthfarm)
            throw new NotFoundException('Farm not found');

        // Idempotent create: same clientId on this farm returns the existing row.
        if (animal.clientId) {
            const byClient = await this.animalRepository.findOne({
                where: { birthFarmId: birthfarm.id, clientId: animal.clientId },
            });
            if (byClient) return byClient;
        }

        const newAnimal = this.animalRepository.create({
            si_id: animal.si_id,
            clientId: animal.clientId ?? null,
            name: animal.name,
            breed: animal.breed,
            gender: animal.gender,
            isLactating: animal.isLactating ?? false,
            isPregnant: animal.isPregnant ?? false,
            birthCountry: animal.birthCountry,
            lactation: animal.lactation,
            dateOfBirth: animal.dateOfBirth,
            acquisitionDate: animal.acquisitionDate,
            birthFarmId: birthfarm.id,
            fatherId: animal.fatherId ?? null,
            motherId: animal.motherId ?? null,
        });

        try {
            return await this.animalRepository.save(newAnimal);
        } catch (error) {
            // Unique violation on si_id or (farm, clientId) (Postgres error code 23505).
            if (error instanceof QueryFailedError && (error as any).code === '23505') {
                // Race on idempotent clientId: another request won the insert.
                if (animal.clientId) {
                    const byClient = await this.animalRepository.findOne({
                        where: { birthFarmId: birthfarm.id, clientId: animal.clientId },
                    });
                    if (byClient) return byClient;
                }
                throw new ConflictException(`Žival z ušesno znamko ${animal.si_id} že obstaja.`);
            }
            throw error;
        }
    }

    async update(id: number, updateAnimalDto: UpdateAnimalDto, farmId: number): Promise<Animal> {
        //find animal by id, scoped to the caller's farm
        const animal = await this.findById(id);
        if(!animal || animal.birthFarmId !== farmId)
            throw new NotFoundException('Animal not found');

        // birthFarmId is not on UpdateAnimalDto (and ValidationPipe whitelist
        // strips unknown keys), so farm ownership stays session-scoped.
        await this.animalRepository.update(id, updateAnimalDto);
        const updatedAnimal = await this.animalRepository.findOne({
            where: { id: id }
        })
        if(!updatedAnimal)
            throw new NotFoundException('Animal does not exist');

        return updatedAnimal;
    }

    async delete(id: number, farmId: number): Promise<void> {
        const animal = await this.findById(id);
        if (!animal || animal.birthFarmId !== farmId)
            throw new NotFoundException('Animal not found');

        await this.animalRepository.delete(id);
    }
}
