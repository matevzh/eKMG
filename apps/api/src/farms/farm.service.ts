import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { Repository } from "typeorm";
import { CreateFarmDto } from "./entities/create-farm.dto";
import { Farm } from "./entities/farm.entity";
import { UsersService } from "../users/user.service";
import { UpdateFarmDto } from "./entities/update-farm.dto";

@Injectable()
export class FarmService {
    private readonly logger = new Logger(FarmService.name);

    constructor(
        @InjectRepository(Farm)
        private readonly farmRepository: Repository<Farm>,
        private readonly usersService: UsersService
    ) {}

    async findById(id: number): Promise<Farm> {
        const farm = await this.farmRepository.findOne({
            where: {id},
            relations: ['users']
        })

        if(!farm)
            throw new NotFoundException('');

        return farm;
    }

    async findAll(): Promise<Farm[]> {
        const farms = await this.farmRepository.find({
            relations: ['users']
        });
        this.logger.log('Farm service - All farms: ', JSON.stringify(farms, null, 2));
        return farms;
    }

    // async findAllUsersByFarm(): Promise<User[]> {
    //     const users = await this.userRepository.find({
    //         relations: ['farms']
    //     });
    //     this.logger.log('Farm service - All users: ', JSON.stringify(users, null, 2));
    //     return users;
    // }

    async create(createFarmDto: CreateFarmDto, userId: number): Promise<Farm> {
        const user = await this.usersService.findById(userId);
        const farmData: any = {
            name: createFarmDto.name,
            location: createFarmDto.location,
            kmg_mid: createFarmDto.kmg_mid,
            province: createFarmDto.province,
            postOffice: createFarmDto.postOffice,
        }

        const newFarm = this.farmRepository.create(farmData);
        const savedFarm = await this.farmRepository.save(newFarm);
        if(Array.isArray(savedFarm)) {
            return savedFarm[0];
        }
        return savedFarm;
    }

    async update(id: number, updateFarmDto: UpdateFarmDto): Promise<Farm> {
        const farm = await this.farmRepository.findOne({
            where: { id: id }
        })
        if(!farm) {
            throw new NotFoundException('Farm does not exist');
        }

        await this.farmRepository.update(id, updateFarmDto);
        const updatedFarm = await this.farmRepository.findOne({where: {id: id}});
        if(!updatedFarm)
            throw new NotFoundException('Farm not found after update');
        return updatedFarm;
    }

    async delete(id: number): Promise<void> {
        await this.farmRepository.delete(id);
    }
}