import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormConfig';
import { BikeModule } from './bikes/bikes.module';
import { ReservedBikeModule } from './reservedBikes/reservedbike.module';

@Module({
  imports: [
    BikeModule,
    ReservedBikeModule,
    TypeOrmModule.forRoot(config),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
