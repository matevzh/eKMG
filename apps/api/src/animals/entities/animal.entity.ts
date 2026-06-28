import { CreateDateColumn, Entity, ManyToOne, OneToOne, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Farm } from "../../farms/entities/farm.entity";

@Entity('animals')
export class Animal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    si_id!: string;

    @Column()
    name!: string;

    @Column()
    breed!: string;

    @Column()
    dateOfBirth!: Date;

    @Column()
    gender!: string;

    @Column()
    status!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column()
    acquisitionDate!: Date;

    @Column()
    dateOfTagging!: Date;

    @OneToOne(() => Animal, (animal) => animal.id)
    father!: number | null;

    @OneToOne(() => Animal, (animal) => animal.id)
    mother!: number | null;

    @ManyToOne(() => Farm, (farm) => farm.id)
    birthFarmId!: number;
}