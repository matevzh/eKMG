import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { UserRegisterDto } from "../auth/user-register.dto";
import { Farm } from "../farms/entities/farm.entity";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async create(user: UserRegisterDto, farm: Farm): Promise<User> {
        const { kmg_mid, ...rest } = user;
        const newUser = this.userRepository.create({ ...rest, farm });
        return await this.userRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email }, relations: ['farm'] })
    }

    async findById(id: number): Promise<User> {
        if(!id) {
            throw new NotFoundException('User ID is required');
        }

        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['farm']
        })

        if(!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }
}