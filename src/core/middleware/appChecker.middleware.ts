import { Injectable, NestMiddleware, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AppCheckerHeaderMiddleware implements NestMiddleware {

  private readonly appCheckerHeaderLogger = new Logger('AppCheckLogger');
  use(req: Request, res: Response, next: NextFunction): void {
    const appHeader = req.headers['app'];
    if (!appHeader) {
      this.appCheckerHeaderLogger.error('App Header Value missing');
      throw new HttpException('Forbidden: Missing or invalid App header', HttpStatus.FORBIDDEN);
    }
    // Log or use the header value as needed
    next();
  }
}
