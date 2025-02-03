import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const logMessage = `📡 ${method} ${originalUrl}`;

    // Log the request path
    this.logger.log(`Incoming request: ${logMessage}`);

    // Move to the next middleware/controller
    next();
  }
}
