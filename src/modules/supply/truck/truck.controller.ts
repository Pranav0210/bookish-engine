import { Controller, Get, Post, Put, Delete, Body, Param, Logger, Req, UseGuards, ValidationPipe, Session, Query, UnauthorizedException, UseInterceptors, UploadedFile } from "@nestjs/common";
import { TruckService } from "./truck.service";
import { CreateTruckDto } from "./dto/create.truck.dto";
import { UpdateTruckDto } from "./dto/update.truck.dto";
import { AuthGuard } from "@nestjs/passport";
import * as XLSX from 'xlsx';
import { ISession } from "src/core/types/session.types";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationInterceptor } from "src/core/interceptor/filevalidator.iterceptor";
import { CreateTransporterDto } from "./dto/create.transporter.dto";
import { UpdateTransporterDto } from "./dto/update.transporter.dto";
import { Prisma } from "@prisma/client";

@UseGuards(AuthGuard('session'))
@Controller('truck')

export class TruckController {
    private logger = new Logger(TruckController.name)

    constructor(private readonly truckService: TruckService) { }

    @Get('all-bulk-truck')
    async getAllBulkTruck(@Req() request: Request, @Session() session: ISession, @Query() query: any) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return await this.truckService.getAllBulkTruckLogs(session.userId, query);
    }

    @Get('all-transporters')
    async getAllTransporters(@Session() session: ISession, @Query() query: { search: string, pageNo: string; pageSize: string }) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        this.logger.log("directory api hit")
        return await this.truckService.getAllTransporters(query.search, query.pageNo, query.pageSize);
    }

    @Get('available-loads')
    async getLoads(@Session() session: ISession, @Query() query: { unit: string }) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return await this.truckService.getDistinctLoads(query.unit as Prisma.EnumUNITFilter<"Registry">);
    }

    @Get('user')
    getTrucks(@Req() request: Request, @Session() session: ISession, @Query() query: any) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return this.truckService.userAddedAllTruck(session.userId, query);
    }

    @Get(':id')
    async getTruck(@Req() request: any, @Param('id') id: string, @Session() session: ISession) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return await this.truckService.getTruck(id);
    }

    @Get('contact/:id')
    async getTruckContact(@Param('id') id: string, @Session() session: ISession) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return await this.truckService.getContact(id, session)
    }

    @Get('transporter/:id')
    async getTransporter(@Req() request: any, @Param('id') id: string, @Session() session: ISession) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return await this.truckService.getTransporter(id);
    }

    @Get('transporter/contact/:id')
    async getTransporterContact(@Param('id') id: string, @Session() session: ISession) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return await this.truckService.getTransporterContact(id, session)
    }

    @Post('transporter')
    async createTransporter(@Body(ValidationPipe) CreateTransporterDto: CreateTransporterDto, @Session() session: ISession) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return this.truckService.addTransporter(CreateTransporterDto, session.userId);
    }

    @Post()
    async createTruck(@Body(ValidationPipe) CreateTruckDto: CreateTruckDto, @Session() session: ISession) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return this.truckService.addSingleTruck(CreateTruckDto, session.userId);
    }


    @Put(':id')
    async updateTruck(@Body(ValidationPipe) UpdateTruckDto: UpdateTruckDto, @Session() session: ISession, @Param('id') id: string) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return this.truckService.updateTruck(id, UpdateTruckDto);
    }

    @Put('transporter/:id')
    async updateTransporter(@Body(ValidationPipe) UpdateTransporterDto: UpdateTransporterDto, @Session() session: ISession, @Param('id') id: string) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return this.truckService.updateTransporter(id, UpdateTransporterDto);
    }

    @Delete(':id')
    async deleteTruck(@Req() request: Request, @Param('id') id: string, @Session() session: ISession) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        return this.truckService.deleteTruck(id);
    }

    @UseInterceptors(FileInterceptor('file'), FileValidationInterceptor)
    @Post('bulktruck')
    async addBulkTruck(@Req() request: any, @Session() session: ISession, @UploadedFile() file) {
        if (!session || !session.userId) {
            throw new UnauthorizedException('Session is missing or invalid');
        }
        //here extract all data from excel file and pass it to addBulkLoad function
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: Array<JSON> = XLSX.utils.sheet_to_json(worksheet);
        return this.truckService.addBulkTruck(session.userId, file.originalname, data);
    }

}