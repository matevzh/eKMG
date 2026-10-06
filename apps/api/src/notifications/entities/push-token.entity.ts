import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entity/user.entity";
import { Farm } from "../../farms/entities/farm.entity";

// An Expo push token registered by a device. `farmId` is denormalized so the
// server can look up every device belonging to a farm in one query; it is still
// a real foreign key, so tokens can't point at a missing farm and are cleaned
// up when the farm is deleted.
@Entity('push_tokens')
export class PushToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    token!: string;

    @Column({ nullable: true })
    platform?: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    userId!: number;

    @ManyToOne(() => Farm, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'farmId' })
    farm!: Farm;

    @Column()
    farmId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
