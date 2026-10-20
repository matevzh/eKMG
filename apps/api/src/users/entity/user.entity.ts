import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt"
import { Farm } from "../../farms/entities/farm.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    firstName!: string;
    @Column()
    lastName!: string;
    @Column({ unique:true })
    email!: string;
    @Column()
    password!: string;

    // GDPR proof of consent: when the user accepted the Terms/Privacy texts and
    // which version they accepted. Nullable for accounts created before consent
    // capture existed; always set for new registrations.
    @Column({ type: 'timestamp', nullable: true })
    consentAcceptedAt?: Date | null;

    @Column({ type: 'varchar', nullable: true })
    consentVersion?: string | null;

    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Farm, (farm) => farm.users, { nullable: false })
    farm!: Farm;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}