import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAnimalDto {
    @IsOptional()
    @IsString()
    si_id!: string;

    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    breed!: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth!: Date;
    
    @IsOptional()
    @IsString()
    gender!: string;

    @IsOptional()
    @IsString()
    status!: string;

    @IsOptional()
    @IsDateString()
    acquisitionDate!: Date;

    @IsOptional()
    @IsString()
    acquisitionType!: string

    @IsOptional()
    @IsDateString()
    dateOfTagging!: Date;

    @IsOptional()
    @IsNumber()
    fatherId!: number | null;

    @IsOptional()
    @IsNumber()
    motherId!: number | null;

    @IsOptional()
    @IsNumber()
    birthFarmId!: number;
    
}