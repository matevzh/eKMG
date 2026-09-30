import { Expose } from "class-transformer";
import { User } from "../../users/entity/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany,  PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('farms')
export class Farm {
    @PrimaryGeneratedColumn()
    @Expose()
    id!: number;
    @Column({ nullable: true })
    name?: string;
    @Column({ nullable: true })
    location?: string;
    @Column({ nullable: false, unique: true })
    kmg_mid!: string;
    @Column({ nullable: true })
    province?: string;
    @Column({ nullable: true })
    postOffice?: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => User, (users) => users.farm)
    users!: User[]

}