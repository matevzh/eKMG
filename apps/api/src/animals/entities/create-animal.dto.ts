import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAnimalDto {
    @IsString()
    name!: string;

    @IsString()
    si_id!: string;

    // Offline client UUID — when set, create is idempotent per farm.
    @IsOptional()
    @IsUUID()
    clientId?: string;

    @IsOptional()
    @IsString()
    breed?: string;

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
