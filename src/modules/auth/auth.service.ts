import { Injectable, Logger } from "@nestjs/common";
import { CreateOtpDto, SubmitOtpDto } from "./dto/create.auth.dto";
import { PrismaService } from "src/core/modules/prisma/prisma.service";
import { User, Prisma } from "@prisma/client";
import axios from "axios";
import { Msg91Service } from "src/core/modules/MSG91/msg91.service";


@Injectable()
export class AuthService {
    private readonly authServiceLogger = new Logger('authServiceLogger');
    constructor(private prisma: PrismaService,private Msg91Service:Msg91Service) { }

    async createOTP(dto: CreateOtpDto, appHeader: string) {
        //1. prisma find or create
        const record: User = await this.prisma.user.upsert({
            where: { phone: dto.phoneNumber },
            update: {
                phone: dto.phoneNumber
            },
            create: {
                phone: dto.phoneNumber
            }
        });

        this.authServiceLogger.log("Comman User Created For : ",dto.phoneNumber)

        if (appHeader === "Demand") {
            await this.prisma.demandTransporter.upsert({
                where: {
                    userId: record.id,  // Unique identifier for the record
                },
                update: {
                    companyName: "",  // Update the company name if the record exists
                    viewedBy: 0,  // Update the viewedBy value if the record exists
                },
                create: {
                    userId: record.id,  // Link the created user
                    companyName: "",  // Pass the company name or default to empty
                    viewedBy: 0,  // Set to 0 or the initial value for 'viewedBy'
                },
            });
            this.authServiceLogger.debug("Inside Demand user creation")
        } else if (appHeader === "Supply") {
            await this.prisma.supplyTransporter.create({
                // where: {
                //     userId: record.id,  // Unique identifier for the record
                // },
                // update: {
                //     companyName: "",  // Update the company name if the record exists
                //     homeBase: "",  // Update the homeBase value if the record exists
                //     viewedBy: 0,  // Update the viewedBy value if the record exists
                // },
                data: {
                    userId: record.id,
                    companyName: "",
                    homeBase: "",
                    viewedBy: 0,
                    operatingLanes: []
                },
            });
            this.authServiceLogger.debug("Inside Supply user creation")
        }

        if(process.env.NODE_ENV === "development") {
            return {
                otp: true,
                message: "Successfully sent OTP to your number.",
            };
        }

        const {data} = await this.Msg91Service.sendOtp(dto.phoneNumber);
        
         // Check response type
    if (data.type === "success") {
        this.authServiceLogger.log(
            `OTP successfully sent to ${dto.phoneNumber}. Request ID: ${data.request_id}`
        );
        return {
            otp: true,
            message: "Successfully sent OTP to your number.",
        };
    } else {
        this.authServiceLogger.error(
            `Failed to send OTP to ${dto.phoneNumber}. Response: ${JSON.stringify(data)}`
        );
        return {
            otp: false,
            message: "Failed to send OTP. Please try again later.",
        };
    }
        
    }

    async resendOTP(dto: CreateOtpDto, appHeader: string) {
        if(process.env.NODE_ENV === "development") {
            return {
                otp: true,
                message: "Successfully sent OTP to your number.",
            };
        }
        const {data} = await this.Msg91Service.resendOtp(dto.phoneNumber);
        if (data.type === "success") {
            this.authServiceLogger.log(
                `OTP successfully sent to ${dto.phoneNumber}. Request ID: ${data.request_id}`
            );
            return {
                otp: true,
                message: "Successfully sent OTP to your number.",
            };
        } else {
            this.authServiceLogger.error(
                `Failed to send OTP to ${dto.phoneNumber}. Response: ${JSON.stringify(data)}`
            );
            return {
                otp: false,
                message: "Failed to send OTP. Please try again later.",
            };
        }
    }

    async verifyOTP(number:string,otp:string) {
        if(process.env.NODE_ENV === "development") {
            if(otp === "123456") {
                const user:any = await this.prisma.user.findUnique({
                    where: {
                        phone: number,
                    },
                });
                if(user) {
                    return {userId: user};
                }
                return null
            }
        }
        const { data } = await this.Msg91Service.verifyOtp(number,otp);
        if (data.type === "success")
        {
            const user:any = await this.prisma.user.findUnique({
                where: {
                    phone: number,
                },
            });

            if(user) {
                return {userId: user};
            }
            return null
        }
        else {
            return null
        }

       
    }

}