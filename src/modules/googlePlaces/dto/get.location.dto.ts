import { IsString } from "class-validator";

export class locationDto {

    @IsString()
    location:string
}