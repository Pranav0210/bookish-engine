import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class Msg91Service {
  constructor(private readonly httpService: HttpService) {}
  private readonly MSG91ServiceLogger = new Logger('Msg91Service');

  private getHeaders() {
    return {
      'Content-Type': 'application/JSON',
    };
  }

  private getVerifyHeaders(token:string) {
    return {
      'authKey': token
    };
  }

  private getURLOTP(
    url: string,
    mobileNumber: string,
    templateId: string,
    authToken: string,
    otpLength: string,
    otpExpiry: string,
    realTimeResponse: string,
  ): string {
    return `${url}/api/v5/otp?otp_length=${otpLength}&otp_expiry=${otpExpiry}&template_id=${templateId}&mobile=${mobileNumber}&authkey=${authToken}&realTimeResponse=${realTimeResponse}`;
  }

  private getResendOtp(
    url: string,
    mobileNumber: string,
    templateId: string,
    authToken: string,
    otpLength: string,
    otpExpiry: string,
    realTimeResponse: string,
  ): string {
    return `${url}/api/v5/otp/retry?otp_length=${otpLength}&otp_expiry=${otpExpiry}&template_id=${templateId}&mobile=${mobileNumber}&authkey=${authToken}&realTimeResponse=${realTimeResponse}`;
  }

  private getVerifyOtp(
    url: string,
    otp: string,
    mobile: string
    
  ): string {
    return `${url}/api/v5/otp/verify?otp=${otp}&mobile=${mobile}`;
  }
  

  async sendOtp(phoneNumber: string): Promise<any> {
    const url = this.getURLOTP(
      process.env.MSG91_BASEURL,
      phoneNumber,
      process.env.MSG91_TEMPLATE_ID,
      process.env.MSG91_AUTH_TOKEN,
      process.env.MSG91_OTP_LENGTH || '6',
      process.env.MSG91_OTP_EXPIRY || '5', // Default expiry time
      process.env.MSG91_REALTIME_RESPONSE || '',
    );

    this.MSG91ServiceLogger.log(`Request URL: ${url}`);

    const headers = this.getHeaders();
    

    try {
      const response = this.httpService.get(url, { headers });
      return await firstValueFrom(response);
    } catch (error) {
      this.MSG91ServiceLogger.error('Error sending OTP', error);
      throw error;
    }
  }

  async verifyOtp(phoneNumber: string,otp:string): Promise<any> {
    const url = this.getVerifyOtp(
      process.env.MSG91_BASEURL,
      otp,phoneNumber,
    );

    this.MSG91ServiceLogger.log(`Request URL: ${url}`);

    const headers = this.getVerifyHeaders(process.env.MSG91_AUTH_TOKEN);
    try {
      const response = this.httpService.get(url,{ headers });
      return await firstValueFrom(response);
    } catch (error) {
      this.MSG91ServiceLogger.error('Error sending OTP', error);
      throw error;
    }
  }

  async resendOtp(phoneNumber: string): Promise<any> {
    const url = this.getResendOtp(process.env.MSG91_BASEURL,
      phoneNumber,
      process.env.MSG91_TEMPLATE_ID,
      process.env.MSG91_AUTH_TOKEN,
      process.env.MSG91_OTP_LENGTH || '6',
      process.env.MSG91_OTP_EXPIRY || '5', // Default expiry time
      process.env.MSG91_REALTIME_RESPONSE || '')
      this.MSG91ServiceLogger.log(`Request URL: ${url}`);

      const headers = this.getHeaders();
      const data = {
        var1: 'Hi',
        var2: 'Thanks',
      };
  
      try {
        const response = this.httpService.post(url, data, { headers });
        return await firstValueFrom(response);
      } catch (error) {
        this.MSG91ServiceLogger.error('Error sending OTP', error);
        throw error;
      }

  }
}
