import { IsDateString, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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

    @IsOptional()
    @IsString()
    notificationId?: string | null;

    @IsOptional()
    @IsInt()
    animalId?: number | null;
}
