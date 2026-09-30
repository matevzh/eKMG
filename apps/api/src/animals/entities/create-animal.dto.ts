import { IsDateString, IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { ANIMAL_STATUSES } from "./animal-status";

export class CreateAnimalDto {
    @IsString()
    name!: string;

    @IsString()
    si_id!: string;

    @IsOptional()
    @IsString()
    breed?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsIn(ANIMAL_STATUSES)
    status?: string;

    @IsOptional()
    @IsString()
    pregnancyStatus?: string;

    @IsOptional()
    @IsString()
    birthCountry?: string;

    @IsOptional()
    @IsInt()
    lactation?: number;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsDateString()
    acquisitionDate?: string;

    @IsOptional()
    @IsDateString()
    dateOfTagging?: string;

    @IsOptional()
    @IsInt()
    fatherId?: number | null;

    @IsOptional()
    @IsInt()
    motherId?: number | null;
}
