import { Module } from "@nestjs/common";
import { GooglePlacesService } from "./googleplaces.service";
import { GoogleController } from "./googleplaces.controller";
import { HttpModule } from "@nestjs/axios";



@Module({
    imports:[HttpModule],
    controllers:[GoogleController],
    providers:[GooglePlacesService],
    exports:[GooglePlacesService]
})

export class GooglePlaceModule {}