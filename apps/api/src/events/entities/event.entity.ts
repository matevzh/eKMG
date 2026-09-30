import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Farm } from "../../farms/entities/farm.entity";
import { Animal } from "../../animals/entities/animal.entity";

// Named CalendarEvent to avoid clashing with the DOM `Event` global type.
@Entity('events')
export class CalendarEvent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true })
    note?: string;

    @Column({ type: 'date' })
    date!: string;

    // Id of the device-local reminder notification, if one was scheduled.
    @Column({ type: 'varchar', nullable: true })
    notificationId?: string | null;

    // Set once the server has sent the "one week before" push reminder, so the
    // scheduler never sends it twice.
    @Column({ type: 'timestamp', nullable: true })
    reminderSentAt?: Date | null;

    // Optional animal this event relates to. Deleting the animal nulls the link
    // rather than removing the event.
    @ManyToOne(() => Animal, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'animalId' })
    animal?: Animal | null;

    @Column({ type: 'int', nullable: true })
    animalId?: number | null;

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
