import { Body, Controller, Logger, Post, Req, Session, UnauthorizedException, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GooglePlacesService } from "./googleplaces.service";
import { ISession } from "src/core/types/session.types";
import { locationDto } from "./dto/get.location.dto";


@UseGuards(AuthGuard('session'))
@Controller('google')

export class GoogleController {
    private logger = new Logger(GoogleController.name);
    constructor(private GooglePlacesService: GooglePlacesService) { }

    @Post('/places')
    async getplaces(@Session() session: ISession,@Body(ValidationPipe) locationBody:locationDto) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        console.log(locationBody.location)
        return await this.GooglePlacesService.getPlaceSuggestions(locationBody.location)

    }
}