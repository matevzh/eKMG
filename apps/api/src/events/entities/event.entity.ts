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

    // Optional client-generated UUID for offline-sync idempotency. Unique per farm
    // so a retried POST returns the existing row instead of creating a duplicate.
    @Column({ type: 'varchar', nullable: true })
    clientId?: string | null;

    @Column({ nullable: true })
    note?: string;

    @Column({ type: 'date' })
    date!: string;

    // Calendar day the push reminder should fire (at 08:00 server local time).
    @Column({ type: 'date', nullable: true })
    reminderDate?: string | null;

    // Id of the device-local reminder notification, if one was scheduled.
    @Column({ type: 'varchar', nullable: true })
    notificationId?: string | null;

    // Set once the server has handled the push reminder, so the scheduler never
    // sends it twice. "Handled" covers both a sent push and a slot that was
    // already too far overdue to be worth sending.
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
