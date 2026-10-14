import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { UserRegisterDto } from "../auth/user-register.dto";
import { Farm } from "../farms/entities/farm.entity";
import { Animal } from "../animals/entities/animal.entity";
import { CalendarEvent } from "../events/entities/event.entity";
import { PushToken } from "../notifications/entities/push-token.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) {}

    async create(user: UserRegisterDto, farm: Farm): Promise<User> {
        const { kmg_mid, acceptedTerms, policyVersion, ...rest } = user;
        const newUser = this.userRepository.create({
            ...rest,
            farm,
            // Record proof of consent at the moment of registration; the DTO has
            // already enforced that acceptedTerms is true.
            consentAcceptedAt: new Date(),
            consentVersion: policyVersion,
        });
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

    /**
     * GDPR Art. 15/20 — export every piece of personal data tied to this user:
     * their account, the farm they belong to, and the farm's herd/calendar data.
     * The password hash is never included.
     */
    async exportData(id: number): Promise<Record<string, unknown>> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['farm'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const { password, ...account } = user;
        const farmId = user.farm?.id;

        const pushTokens = await this.dataSource
            .getRepository(PushToken)
            .find({ where: { userId: id } });

        const animals = farmId
            ? await this.dataSource.getRepository(Animal).find({ where: { birthFarmId: farmId } })
            : [];
        const events = farmId
            ? await this.dataSource.getRepository(CalendarEvent).find({ where: { farmId } })
            : [];

        return {
            exportedAt: new Date().toISOString(),
            account,
            farm: user.farm ?? null,
            animals,
            events,
            pushTokens,
        };
    }

    /**
     * GDPR Art. 17 — hard-delete the user and all their personal data.
     *
     * Deleting the `users` row cascades the user's `push_tokens` (FK ON DELETE
     * CASCADE). The farm is shared across everyone registered under the same
     * KMG-MID, so it — along with its animals and events (also ON DELETE
     * CASCADE) — is only removed when this user was the farm's last member.
     * Otherwise the herd data belongs to the remaining members and is retained.
     */
    async deleteAccount(id: number): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const user = await manager.findOne(User, {
                where: { id },
                relations: ['farm'],
            });

            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            const farmId = user.farm?.id;

            await manager.delete(User, id);

            if (farmId) {
                const remaining = await manager.count(User, {
                    where: { farm: { id: farmId } },
                });
                if (remaining === 0) {
                    await manager.delete(Farm, farmId);
                }
            }
        });
    }

    async updateUser(id: number, updateUserDto: Partial<User>): Promise<User> {
        const user = await this.findById(id);
        if(!user) {
            throw new NotFoundException("User not found");
        }

        await this.userRepository.update(id, updateUserDto);
        const updatedUser = await this.findById(id);
        if(!updatedUser) {
            throw new NotFoundException("User not found after update");
        }
        return updatedUser;
    }
}