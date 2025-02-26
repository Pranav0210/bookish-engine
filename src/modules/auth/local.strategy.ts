import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(phoneNumber:string,otp:string): Promise<any> {
    //adding auth service verify otp
    const user:any = await this.authService.verifyOTP(phoneNumber,otp);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}