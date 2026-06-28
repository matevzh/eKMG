import { IsOptional, IsString } from "class-validator";

export class UpdateFarmDto {
    @IsOptional()
    @IsString()
    name!: string;
    @IsOptional()
    @IsString()
    location!: string;
    @IsOptional()
    @IsString()
    kmg_mid!: string;
    @IsOptional()
    @IsString()
    province!: string;
    @IsOptional()
    @IsString()
    postOffice!: string;
}