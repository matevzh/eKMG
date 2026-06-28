import { IsString } from "class-validator";

export class CreateFarmDto {
    @IsString()
    name!: string;
    @IsString()
    location!: string;
    @IsString()
    kmg_mid!: string;
    @IsString()
    province!: string;
    @IsString()
    postOffice!: string;
}