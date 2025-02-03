import { IsString, IsNotEmpty, IsNumber, IsEnum, IsISO8601 } from 'class-validator';

export class CreateTruckDto {

    @IsString()
    @IsNotEmpty()
    regnNo?: string;

    @IsNumber()
    @IsNotEmpty()
    tires: number;

    @IsString()
    @IsNotEmpty()
    capacity: string;

    @IsString()
    @IsNotEmpty()
    bodyType: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['SMALL', 'MEDIUM'])
    axleType: string;

    @IsString()
    @IsNotEmpty()
    pickupPoint?: string;

    @IsString()
    @IsNotEmpty()
    dropPoint?: string;

    @IsNumber()
    @IsNotEmpty()
    fare: number;

    @IsISO8601()
    @IsNotEmpty()
    expirationTime: Date;
}
