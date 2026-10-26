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

    @IsString()
    breed?: string;

    @IsString()
    gender?: string;

    @IsBoolean()
    isLactating?: boolean;

    @IsBoolean()
    isPregnant?: boolean;

    @IsOptional()
    @IsString()
    birthCountry?: string;

    @IsInt()
    lactation?: number;

    @IsDateString()
    dateOfBirth?: string;

    @IsDateString()
    acquisitionDate?: string;

    @IsDateString()
    dateOfTagging?: string;

    @IsOptional()
    @IsInt()
    fatherId?: number | null;

    @IsOptional()
    @IsInt()
    motherId?: number | null;
}
