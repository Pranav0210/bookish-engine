import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileValidationMiddleware } from 'src/core/middleware/fileTypeCheck.middleware';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  private fileValidationMiddleware = new FileValidationMiddleware();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Check for valid Excel file only
    const file = request.file; // Get the uploaded file
    if (file && this.fileValidationMiddleware.isValidExcel(file.mimetype)) {
      return next.handle(); // If valid, proceed to the next handler
    }

    // Throw HttpException for invalid file type
    throw new HttpException('Invalid Excel file type', HttpStatus.BAD_REQUEST);
  }
}
