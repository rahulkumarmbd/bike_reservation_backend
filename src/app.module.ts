import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormConfig';
import { BikeModule } from './bikes/bikes.module';
import { CommentModule } from './comments/comment.module';
import { ReservedBikeModule } from './reservedBikes/reservedBikes.module';
import { UserModule } from './users/users.module';
// import { UserModule } from './users/users.module';

@Module({
  imports: [
    BikeModule,
    CommentModule,
    ReservedBikeModule,
    UserModule,
    TypeOrmModule.forRoot(config),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
