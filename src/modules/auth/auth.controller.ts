import { Body, Controller, Get, Post, ValidationPipe, Logger, Header, Headers, Req, UseGuards, Ip, Session, UnauthorizedException, Res } from "@nestjs/common";
import { CreateOtpDto, SubmitOtpDto } from "./dto/create.auth.dto";
import { AuthService } from "./auth.service";
import { Request } from 'express'; // Import the Request type from express
import { LocalStrategy } from "./local.strategy";
import { LocalAuthGuard } from "./guards/local.auth.guard";
import { ISession } from "src/core/types/session.types";

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService, private readonly LocalStrategy: LocalStrategy) { }

    @Post('/otp')
    async createOtp(@Body(ValidationPipe) createOtpDto: CreateOtpDto, @Headers('App') appHeader: string, @Req() request: Request) {
        const userIp = request.ip; // Get IP from request object
        this.logger.log(`Creating OTP for app: ${appHeader} from IP: ${userIp}`);
        return await this.authService.createOTP(createOtpDto, appHeader);
    }

    // @UseGuards(LocalAuthGuard)
    @Post('/verify')
    async verifyOtp(@Body(ValidationPipe) submitOtpDto: SubmitOtpDto, @Headers('App') appHeader, @Req() request: Request, @Ip() ip, @Session() session: ISession) {
        const userIp = request.ip; // Get IP from request object
        this.logger.log(`Verifying OTP for user from IP: ${userIp} ${ip}`);
        let phoneNumber = submitOtpDto.phoneNumber
        let otp = submitOtpDto.otp
        const data = await this.LocalStrategy.validate(phoneNumber, otp);
        session.userId = data.userId.id
        return data;
    }

    @Post('/resendotp')
    async resendOtp(@Body(ValidationPipe) createOtpDto: CreateOtpDto, @Headers('App') appHeader: string, @Req() request: Request, @Ip() ip) {
        // Get IP from request object
        this.logger.log(`Resending OTP for app: ${appHeader} from IP: ${ip}`);
        return await this.authService.resendOTP(createOtpDto, appHeader);
    }

    @Get('/me')
    async authorizeClient(@Session() session: ISession) {
        if (session.userId)
            return {
                isAuthorized: true,
                userId: session.userId
            }
        else
            throw new UnauthorizedException()
    }

    @Get('logout')
    async logout(@Req() req: any, @Res() res: any) {
        req.logOut(() => {
            req.session.cookie.maxAge = 0;
        });
    }
}
