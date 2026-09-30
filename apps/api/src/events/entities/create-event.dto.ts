import { IsDateString, IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { EVENT_TITLES } from "./event-title";

export class CreateEventDto {
    @IsIn(EVENT_TITLES)
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
