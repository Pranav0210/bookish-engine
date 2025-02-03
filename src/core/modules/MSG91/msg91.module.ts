import { HttpModule } from "@nestjs/axios";
import {Module} from "@nestjs/common";
import { Msg91Service } from "./msg91.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [HttpModule,ConfigModule.forRoot({
        envFilePath: ['.env']
      })],
    providers: [Msg91Service]

})

export class MSG91Module{}