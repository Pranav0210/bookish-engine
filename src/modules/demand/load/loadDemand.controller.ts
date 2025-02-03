import { Controller, Get, Post, Put, Delete, Body, Param, Logger, ValidationPipe, Req, UseGuards, Session, Query, UnauthorizedException, UploadedFile, UseInterceptors, NestMiddleware } from "@nestjs/common";
import { LoadService } from "./loadDemand.service";
import { CreateLoadDto } from "./dto/create.load.dto";
import { UpdateLoadDto } from "./dto/update.load.dto";
import { AuthGuard } from "@nestjs/passport";
import { ISession } from "src/core/types/session.types";
import * as XLSX from 'xlsx';
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationInterceptor } from "src/core/interceptor/filevalidator.iterceptor";
import { GetConfigDto } from "./dto/loadconfig.load.dto";


@UseGuards(AuthGuard('session'))
@Controller('load')
export class LoadController {

  private logger = new Logger(LoadController.name);

  constructor(private loadService: LoadService) { }

  @Get('/user')
  async getLoads(@Req() request: any, @Session() session: ISession, @Query() query: any) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return await this.loadService.userAddedAllLoad(session.userId, query);
  }

  @Get('/allbulk')
  async getAllBulkLog(@Req() request: Request, @Session() session: ISession, @Query() query: any) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return this.loadService.getAllBulklog(session.userId, query);
  }

  @UseInterceptors(FileInterceptor('file'), FileValidationInterceptor)
  @Post('/bulkload')
  async addBulkLoad(@Req() request: any, @Session() session: ISession, @UploadedFile() file) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    //here extract all data from excel file and pass it to addBulkLoad function
    // console.log(file.originalname)
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: Array<JSON> = XLSX.utils.sheet_to_json(worksheet);
    // console.log(workbook, worksheet, data)
    return this.loadService.addBulkLoad(data, session.userId, file.originalname);

  }

  @Get('/contact/:id')
  async getLoadContact(@Param('id') id: string, @Session() session: ISession) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return this.loadService.getContact(id, session)
  }

  @Get(':id')
  async getLoad(@Req() request: any, @Param('id') id: string, @Session() session: ISession) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return await this.loadService.getLoad(id);
  }

  @Get('bulk/:id')
  async getBulkLoad(@Req() request: any, @Param('id') id: string, @Session() session: ISession, @Query() query: any) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return await this.loadService.getBulkLoad(id, query, session.userId);
  }
  @Post('/')
  async createLoad(@Body(ValidationPipe) CreateLoadDto: CreateLoadDto, @Session() session: ISession) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return this.loadService.addSingleLoad(CreateLoadDto, session.userId);
  }

  @Put('/:id')
  async updateLoad(@Body(ValidationPipe) UpdateLoadDto: UpdateLoadDto, @Param('id') id: string, @Session() session: ISession) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return this.loadService.updateLoad(id, UpdateLoadDto);
  }


  @Post('/fetch/config')
  async getLoadConfig(@Body(ValidationPipe) toneInfo: GetConfigDto, @Req() request: Request, @Session() session: ISession) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return this.loadService.getLoadConfig(toneInfo.toneage, toneInfo.unit);
  }


  @Delete('/:id')
  async deleteLoad(@Req() request: Request, @Param('id') id: string, @Session() session: ISession) {
    if (!session || !session.userId) {
      throw new UnauthorizedException('Session is missing or invalid');
    }
    return this.loadService.deleteLoad(id);
  }
}
