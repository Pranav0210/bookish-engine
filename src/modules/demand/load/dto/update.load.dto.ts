import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateLoadDto {
    @IsString()
    @IsOptional()
    weight?: string;

    @IsString()
    @IsOptional()
    materialName?: string;
    
    @IsString()
    @IsOptional()
    pickupPoint?: string;

    @IsString()
    @IsOptional()
    dropPoint?: string;

    @IsISO8601()
    @IsOptional()
    expirationTime?: string;

    @IsNumber()
    @IsOptional()
    fare?: number;

    @IsString()
    @IsOptional()
    truckLength?: string;

    // @IsString()
    // @IsOptional()
    // truckContainer?: string;

    @IsString()
    @IsOptional()
    truckBody?: string;

    @IsString()
    @IsOptional()
    truckAxle?: string;

    @IsNumber()
    @IsOptional()
    truckTires?: number;
}
