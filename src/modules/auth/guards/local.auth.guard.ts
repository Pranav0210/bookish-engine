import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    console.log("FIRSTLINE")
    const result = (await super.canActivate(context)) as boolean;
    console.log("SECOND LINE")
    const request = context.switchToHttp().getRequest();
    console.log("THIRD LINE")
    await super.logIn(request);
    return result;
  }
}