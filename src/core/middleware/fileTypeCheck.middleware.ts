import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class FileValidationMiddleware implements NestMiddleware {
  private readonly appFileCheckLogger = new Logger('FileCheckLogger');

  // Define valid mime types
  private readonly validMimeTypes = {
    pdf: ['application/pdf'],
    excel: [
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/svg+xml'],
  };

  use(req: any, res: Response, next: NextFunction) {
    const file = req.file; // Get the uploaded file

    if (!file) {
      throw new UnauthorizedException('No file uploaded');
    }

    const mimeType = file.mimetype; // Get file's MIME type

    // Check if the file is a valid PDF, Excel, or Image
    if (this.isValidPdf(mimeType) || this.isValidExcel(mimeType) || this.isValidImage(mimeType)) {
      return next(); // If valid, proceed to the next handler
    }

    // If invalid, throw an exception
    throw new UnauthorizedException('Invalid file type');
  }

  // Check if the file is a valid PDF
  public isValidPdf(mimeType: string): boolean {
    return this.validMimeTypes.pdf.includes(mimeType);
  }

  // Check if the file is a valid Excel file
  public isValidExcel(mimeType: string): boolean {
    return this.validMimeTypes.excel.includes(mimeType);
  }

  // Check if the file is a valid image
  public isValidImage(mimeType: string): boolean {
    return this.validMimeTypes.image.includes(mimeType);
  }
}
