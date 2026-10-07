import { Equals, IsBoolean, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UserRegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;
    @IsNotEmpty()
    @IsString()
    name!: string;
    @IsNotEmpty()
    @IsStrongPassword()
    password!: string;
    @IsNotEmpty()
    @IsString()
    kmg_mid!: string;

    // GDPR consent: registration is rejected unless the user explicitly accepted
    // the Terms/Privacy texts. policyVersion records which version they saw.
    @IsBoolean()
    @Equals(true, { message: "Za registracijo je treba sprejeti pogoje uporabe in politiko zasebnosti." })
    acceptedTerms!: boolean;
    @IsNotEmpty()
    @IsString()
    policyVersion!: string;
}