import { IsString, IsNotEmpty, IsNumber, IsEnum, IsISO8601 } from 'class-validator';

export class UpdateTruckDto {

    @IsString()
    regnNo?: string;

    @IsNumber()
    tires?: number;

    @IsString()
    @IsNotEmpty()
    capacity: string;

    @IsString()
    @IsNotEmpty()
    bodyType: string;

    @IsString()
    @IsEnum(['SMALL', 'MEDIUM'])
    axleType?: string;

    @IsString()
    pickupPoint?: string;

    @IsString()
    dropPoint?: string;

    @IsNumber()
    fare?: number;

    @IsISO8601()
    expirationTime?: Date;
}
