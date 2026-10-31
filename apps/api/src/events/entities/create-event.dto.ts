import { IsDateString, IsInt, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateEventDto {
    @IsString()
    @MinLength(1)
    @MaxLength(80)
    title!: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsDateString()
    date!: string;

    /** Calendar day the push reminder should fire (08:00). Must be on or before `date`. */
    @IsDateString()
    reminderDate!: string;

    @IsOptional()
    @IsString()
    notificationId?: string | null;

    @IsOptional()
    @IsInt()
    animalId?: number | null;

    // Offline client UUID — when set, create is idempotent per farm.
    @IsOptional()
    @IsUUID()
    clientId?: string;
}
