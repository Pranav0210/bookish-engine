import { Module, UseGuards } from "@nestjs/common";
import { PrismaService } from "src/core/modules/prisma/prisma.service"
import { LoadController } from "./loadDemand.controller";
import { LoadService } from "./loadDemand.service";
import { FileValidationMiddleware } from "src/core/middleware/fileTypeCheck.middleware";
import { FileValidationInterceptor } from "src/core/interceptor/filevalidator.iterceptor";
import { GooglePlaceModule } from "src/modules/googlePlaces/googleplaces.module";

@Module({
    imports: [GooglePlaceModule],
    controllers: [LoadController],
    providers: [PrismaService,LoadService,FileValidationInterceptor,FileValidationMiddleware],
    exports: []
})

export class LoadDemandModule {}