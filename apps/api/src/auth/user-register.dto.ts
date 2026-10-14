import { Equals, IsBoolean, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UserRegisterDto {
    @IsNotEmpty()
    @IsEmail({}, { message: "Neveljaven e-poštni naslov." })
    email!: string;
    @IsNotEmpty()
    @IsString()
    firstName!: string;
    @IsNotEmpty()
    @IsString()
    lastName!: string;
    @IsNotEmpty()
    @IsStrongPassword({}, { message: "Geslo mora vsebovati vsaj 8 znakov, eno veliko črko, eno malo črko, eno številko in en poseben znak." })
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