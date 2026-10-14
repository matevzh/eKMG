import { IsEmail, IsNotEmpty } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail({}, { message: "Neveljaven e-poštni naslov." })
    email!: string;
    @IsNotEmpty()
    password!: string;
}