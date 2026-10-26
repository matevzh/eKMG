import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsBoolean()
    isLactating?: boolean;

    @IsOptional()
    @IsBoolean()
    isPregnant?: boolean;

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

    // birthFarmId is intentionally omitted — farm ownership comes from the JWT only.
}