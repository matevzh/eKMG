import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entity/user.entity";

// An Expo push token registered by a device. `farmId` is denormalized so the
// server can look up every device belonging to a farm in one query.
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

    @Column()
    farmId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
