import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateOtpDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+91[6-9]\d{9}$/, {
        message: "phoneNumber must be a valid Indian phone number (starting with +91 and 10 digits).",
    })
    phoneNumber: string;
}

export class SubmitOtpDto {
    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+91[6-9]\d{9}$/, {
        message: "phoneNumber must be a valid Indian phone number (starting with +91 and 10 digits).",
    })
    phoneNumber: string;
}