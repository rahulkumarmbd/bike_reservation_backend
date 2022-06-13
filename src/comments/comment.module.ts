import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/bike.entity';
import { BikeController } from 'src/bikes/bikes.controller';
import { BikeService } from 'src/bikes/bikes.service';
import { ReservedBikeController } from 'src/reservedBikes/reservedBike.controller';
import { ReservedBikeService } from 'src/reservedBikes/reservedBike.service';
import { ReservedBike } from 'src/reservedBikes/reservedBikes.entity';
import { User } from 'src/users/user.entity';
import { UserController } from 'src/users/users.controller';
import { UserService } from 'src/users/users.service';
import { commentController } from './comment.controller';
import { Comment } from './comment.entity';
import { commentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Bike, ReservedBike])],
  controllers: [
    commentController,
    UserController,
    BikeController,
    ReservedBikeController,
  ],
  providers: [commentService, UserService, BikeService, ReservedBikeService],
})

export class CommentModule {}
