import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/bike.entity';
import { BikeController } from 'src/bikes/bikes.controller';
import { BikeModule } from 'src/bikes/bikes.module';
import { BikeService } from 'src/bikes/bikes.service';
import { commentController } from 'src/comments/comment.controller';
import { Comment } from 'src/comments/comment.entity';
import { commentService } from 'src/comments/comment.service';
import { User } from 'src/users/user.entity';
import { UserController } from 'src/users/users.controller';
import { UserService } from 'src/users/users.service';
import { ReservedBikeController } from './reservedBike.controller';
import { ReservedBikeService } from './reservedBike.service';
import { ReservedBike } from './reservedBikes.entity';

@Module({
  imports: [
    BikeModule,
    TypeOrmModule.forFeature([ReservedBike, Bike, Comment, User]),
  ],
  controllers: [
    ReservedBikeController,
    BikeController,
    commentController,
    UserController,
  ],
  providers: [ReservedBikeService, BikeService, commentService, UserService],
})
export class ReservedBikeModule {}
