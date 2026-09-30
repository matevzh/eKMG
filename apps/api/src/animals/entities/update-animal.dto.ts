import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { ANIMAL_STATUSES } from "./animal-status";

export class UpdateAnimalDto {
    @IsOptional()
    @IsString()
    si_id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    breed?: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsIn(ANIMAL_STATUSES)
    status?: string;

    @IsOptional()
    @IsInt()
    lactation?: number;

    @IsOptional()
    @IsDateString()
    acquisitionDate?: string;

    @IsOptional()
    @IsString()
    acquisitionType?: string;

    @IsOptional()
    @IsDateString()
    dateOfTagging?: string;

    @IsOptional()
    @IsNumber()
    fatherId?: number | null;

    @IsOptional()
    @IsNumber()
    motherId?: number | null;

    @IsOptional()
    @IsNumber()
    birthFarmId?: number;

}