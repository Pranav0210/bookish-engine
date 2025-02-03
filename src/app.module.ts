import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppCheckerHeaderMiddleware } from './core/middleware/appChecker.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoadSupplyModule } from './modules/supply/truck/truck.module';
import { LoadDemandModule } from './modules/demand/load/loadDemand.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoadMarketplaceModule } from './modules/demand/marketplace/marketplace.module';
import { TruckMarketplaceModule } from './modules/supply/marketplace/marketplace.module';
import { GooglePlaceModule } from './modules/googlePlaces/googleplaces.module';



@Module({
  imports: [LoadSupplyModule, LoadDemandModule,GooglePlaceModule,LoadMarketplaceModule,TruckMarketplaceModule,AuthModule,ConfigModule.forRoot({
    envFilePath: ['.env']
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppCheckerHeaderMiddleware).forRoutes({path:'*',method:RequestMethod.ALL})
  }
}
