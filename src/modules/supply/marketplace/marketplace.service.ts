import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/core/modules/prisma/prisma.service";

@Injectable()

export class MarketplaceService {
    private readonly LoadServiceLogger = new Logger('MarketPlaceLogger');
    constructor(private prisma: PrismaService) { }

    async TruckMarketplace(search: string | '', pageNo: any, pageSize: any) {
        const skip = (pageNo - 1) * pageSize;

        try {
            const loadMarketPlace = await this.prisma.trucks.findMany({
                where: {
                    OR: [
                        {
                            pickupPoint: {
                                contains: search
                            }
                        },
                        {
                            dropPoint: {
                                contains: search
                            }
                        },
                        {
                            regnNo: {
                                contains: search,
                            }
                        }
                    ],
                    deletedAt: null
                },
                take: Number(pageSize),
                skip: skip
            });

            return { data: loadMarketPlace, message: "Marketplace Fetched Successfully" };
        } catch (error) {
            throw new Error(`Failed to fetch loads: ${error.message}`);
        }
    }
}
