import { Controller, Get, Logger, Query, Req, Session, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MarketplaceService } from "./marketplace.service";
import { ISession } from "src/core/types/session.types";


@UseGuards(AuthGuard('session'))
@Controller('marketplace')
export class LoadMarketplaceController {
    private logger = new Logger(LoadMarketplaceController.name);

    constructor(private MarketplaceService: MarketplaceService) { }

    @Get('/load')
    async getLoads(@Req() request: any, @Session() session: ISession, @Query() query: { search:string ,pageNo: string; pageSize: string }) {
        if (!session || !session.userId) {
              throw new UnauthorizedException('Session is missing or invalid');
            }
        return await this.MarketplaceService.LoadMarketplace(query.search, query.pageNo, query.pageSize);
    }
}