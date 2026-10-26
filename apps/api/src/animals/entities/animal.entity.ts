import { CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Farm } from "../../farms/entities/farm.entity";

@Entity('animals')
export class Animal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    si_id!: string;

    // Optional client-generated UUID for offline-sync idempotency (unique per farm).
    @Column({ type: 'varchar', nullable: true })
    clientId?: string | null;

    @Column()
    name!: string;

    @Column({ nullable: true })
    breed?: string;

    @Column({ nullable: true })
    gender?: string;

    @Column({ type: 'boolean', default: false })
    isLactating!: boolean;

    @Column({ type: 'boolean', default: false })
    isPregnant!: boolean;

    @Column({ nullable: true })
    birthCountry?: string;

    // Current lactation number, surfaced in the mobile app.
    @Column({ type: 'int', nullable: true })
    lactation?: number;

    @Column({ type: 'date', nullable: true })
    dateOfBirth?: string;

    @Column({ type: 'date', nullable: true })
    acquisitionDate?: string;

    @Column({ type: 'date', nullable: true })
    dateOfTagging?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: 'int', nullable: true })
    fatherId?: number | null;

    @Column({ type: 'int', nullable: true })
    motherId?: number | null;

    @ManyToOne(() => Farm, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'birthFarmId' })
    birthFarm!: Farm;

    @Column()
    birthFarmId!: number;
}
