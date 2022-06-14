import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/bike.entity';
import { BikeController } from 'src/bikes/bikes.controller';
import { BikeModule } from 'src/bikes/bikes.module';
import { BikeService } from 'src/bikes/bikes.service';
import { commentController } from 'src/comments/comment.controller';
import { Comment } from 'src/comments/comment.entity';
import { commentService } from 'src/comments/comment.service';
import { ReservedBikeController } from 'src/reservedBikes/reservedBike.controller';
import { ReservedBikeService } from 'src/reservedBikes/reservedBike.service';
import { ReservedBike } from 'src/reservedBikes/reservedBikes.entity';
import { User } from './user.entity';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,Bike, Comment,ReservedBike])],
  controllers: [UserController,BikeController,commentController,ReservedBikeController],
  providers: [UserService,BikeService,commentService,ReservedBikeService],
})
export class UserModule {}
