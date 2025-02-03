import { IsString,IsOptional, IsEnum, IsNumber } from "class-validator";

export class GetConfigDto {
    @IsNumber()
    @IsOptional()
    toneage?: number;

    @IsString()
    @IsOptional()
    @IsEnum(['TN','KL'])
    unit?: string;

}