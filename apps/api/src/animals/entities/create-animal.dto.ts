import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export enum PregnancyStatus {
    PREGNANT = 'pregnant',
    LACTATING = 'lactating',
    WEANED = 'weaned',
    INACTIVE = 'inactive',
}

export enum Status {
    HEALTHY = 'healthy',
    SICK = 'sick',
    SOLD = 'sold',
    DECEASED = 'deceased',
}

export enum Breed {
    NN = 'NN',
    RJ = 'RJ',
    LS = 'LS',
    ČB = 'ČB',
    MB = 'MB',
    CK = 'CK',
    ME = 'ME',
    AR = 'AR',
    HF = 'HF',
    NZ = 'NZ',
    LIM = 'LIM',
    CHA = 'CHA',
    BBP = 'BBP',
    BAQ = 'BAQ',
    GLW = 'GLW',
    RH = 'RH',
    PIE = 'PIE',
    AAG = 'AAG',
    HLA = 'HLA',
    PZB = 'PZB',
    KS = 'KS',
    HEF = 'HEF',
    RAG = 'RAG',
    RW = 'RW',
    PZ = 'PZ',
    AL = 'AL',
    GAG = 'GAG',
    SAL = 'SAL',
    JE = 'JE',
    AY = 'AY',
    GS = 'GS',
    LCR = 'LCR',
    GV = 'GV',
    DR = 'DR',
    GCN = 'GCN',
    BZD = 'BZD',
    IGO = 'IGO',
    PDL = 'PDL',
    KBV = 'KBV',
    MCG = 'MCG',
    NO = 'NO',
    WGE = 'WGE',
    CNN = 'CNN',
    INR = 'INR',
    SR = 'SR',
    DAH = 'DAH',
    AUB = 'AUB',
    TLH = 'TLH',
    SPP = 'SPP',
    MIX = 'MIX',
    LSX = 'LSX',
    KR = 'KR',
}

export class CreateAnimalDto {
    @IsString()
    name!: string;

    @IsString()
    si_id!: string;

    @IsEnum(Breed)
    breed!: Breed;
    
    @IsString()
    gender!: string;
    
    @IsEnum(PregnancyStatus)
    pregnancyStatus!: PregnancyStatus;

    @IsEnum(Status)
    status!: Status;

    @IsString()
    birthCountry!: string;
    
    @IsNumber()
    birthFarmId!: number;
    
    @IsDateString()
    dateOfBirth!: string;
    
    @IsDateString()
    acquisitionDate!: string;

    @IsDateString()
    dateOfTagging!: string;
    
    @IsNumber()
    @IsOptional()
    fatherId!: number | null;

    @IsNumber()
    @IsOptional()
    motherId!: number | null;
}