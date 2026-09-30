import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt"
import { Farm } from "../../farms/entities/farm.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string;
    @Column({ unique:true })
    email!: string;
    @Column()
    role!: string;
    @Column()
    password!: string;
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Farm, (farm) => farm.users)
    farm!: Farm;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}