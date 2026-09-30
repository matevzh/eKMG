import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UserRegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;
    @IsNotEmpty()
    @IsString()
    name!: string;
    @IsNotEmpty()
    @IsString()
    role!: string;
    @IsNotEmpty()
    @IsStrongPassword()
    password!: string;
    @IsNotEmpty()
    @IsString()
    kmg_mid!: string;
}