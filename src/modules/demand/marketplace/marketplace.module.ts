import { Module } from "@nestjs/common";
import { PrismaService } from "src/core/modules/prisma/prisma.service";
import { MarketplaceService } from "./marketplace.service";
import { LoadMarketplaceController } from "./marketplace.controller";


@Module({
    imports: [],
    controllers: [LoadMarketplaceController],
    providers: [PrismaService,MarketplaceService],
    exports: []
})

export class LoadMarketplaceModule {}