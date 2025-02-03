import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/core/modules/prisma/prisma.service";
import { MSG91Module } from "src/core/modules/MSG91/msg91.module";
import { HttpModule } from "@nestjs/axios";
import { Msg91Service } from "src/core/modules/MSG91/msg91.service";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { SessionSerializer } from "./session.serializer";
@Module({
    imports: [MSG91Module,HttpModule,PassportModule.register({session:true})],
    controllers: [AuthController],
    providers: [AuthService,PrismaService,Msg91Service,LocalStrategy,SessionSerializer],
    exports: []
})

export class AuthModule{}