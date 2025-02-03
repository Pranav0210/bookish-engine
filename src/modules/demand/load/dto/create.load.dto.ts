import { IsISO8601, IsNotEmpty, IsNumber, IsString } from "class-validator";

enum UnitType{
    'TN',
    'KL'
}
export class CreateLoadDto {
    @IsString({message: "Weight must be a string"})
    @IsNotEmpty({message: "Weight is required"})
    weight: string;
    
    @IsString({message: "Unit must be either TN or KL"})
    @IsNotEmpty({message: "Unit is required"})
    unit: string;

    @IsString({message: "MaterialName must be a string"})
    @IsNotEmpty({message: "MaterialName is required"})
    materialName?: string;
    
    @IsString({message: "PickupPoint must be a string"})
    @IsNotEmpty({message: "PickupPoint is required"})
    pickupPoint?: string;

    @IsString({message : "DropPoint must be a string"})
    @IsNotEmpty({message: "DropPoint is required"})
    dropPoint?: string;

    @IsISO8601()
    @IsNotEmpty({message: "ExpirationTime is required"})
    expirationTime?: string;

    @IsNumber()
    @IsNotEmpty({message: "Fare is required"})
    fare: number;

    @IsString({message: "TruckLength must be a string"})
    @IsNotEmpty({message: "TruckLength is required"})
    truckLength?: string;

    // @IsString({message: "TruckContainer must be a string"})
    // @IsNotEmpty({message: "TruckContainer is required"})
    // truckContainer?: string;

    @IsString({message: "TruckBody must be a string"})
    @IsNotEmpty({message: "TruckBody is required"})
    truckBody?: string;

    @IsString({message: "TruckAxle must be a string"})
    @IsNotEmpty({message: "TruckAxle is required"})
    truckAxle?: string;

    @IsNumber()
    @IsNotEmpty({message: "TruckTires is required"})
    truckTires?: number;
}
