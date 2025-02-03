import { Module } from "@nestjs/common";
import { PrismaService } from "src/core/modules/prisma/prisma.service";
import { TruckController } from "./truck.controller";
import { TruckService } from "./truck.service";
import { GooglePlaceModule } from "src/modules/googlePlaces/googleplaces.module";

@Module({
    imports: [GooglePlaceModule],
    controllers: [TruckController],
    providers: [PrismaService,TruckService],
    exports: []
})


export class LoadSupplyModule {}