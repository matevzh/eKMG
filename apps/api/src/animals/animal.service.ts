import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Animal } from "./entities/animal.entity";
import { CreateAnimalDto, PregnancyStatus } from "./entities/create-animal.dto";
import { UpdateAnimalDto } from "./entities/update-animal.dto";
import { Farm } from "../farms/entities/farm.entity";
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

        const animalData: any = {
            si_id: animal.si_id,
            name: animal.name,
            breed: animal.breed,
            gender: animal.gender,
            pregnancyStatus: animal.pregnancyStatus,
            status: animal.status,
            birthCountry: animal.birthCountry,
            dateOfBirth: animal.dateOfBirth,
            acquisitionDate: animal.acquisitionDate,
            dateOfTagging: animal.dateOfTagging,
            birthFarmId: birthfarm.id,
            father: animal.fatherId,
            mother: animal.motherId
        }
        
        const newAnimal = this.animalRepository.create(animalData);
        const savedAnimal = await this.animalRepository.save(newAnimal);
        if(Array.isArray(savedAnimal)) {
            return savedAnimal[0];
        }
        return savedAnimal;
    }

    async update(id: number, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
        //find animal by id
        const animal = await this.findById(id);
        if(!animal)
            throw new NotFoundException('Animal not found');

        await this.animalRepository.update(id, updateAnimalDto);
        const updatedAnimal = await this.animalRepository.findOne({
            where: { id: id }
        })
        if(!updatedAnimal)
            throw new NotFoundException('Animal does not exist');
            
        return updatedAnimal;
    }

    //todo: fix
    async findBySiId(si_id:string, id: number): Promise<Animal | null> {
        const animal = await this.animalRepository.findOne({
            where: { id: id }
        })
        if(!animal) {
            throw new NotFoundException('Animal not found');
        }
    }

    async delete(id: number): Promise<void> {
        await this.animalRepository.delete(id);
    }
}