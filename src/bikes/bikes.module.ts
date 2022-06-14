import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commentController } from 'src/comments/comment.controller';
import { Comment } from 'src/comments/comment.entity';
import { commentService } from 'src/comments/comment.service';
import { ReservedBikeController } from 'src/reservedBikes/reservedBike.controller';
import { ReservedBikeService } from 'src/reservedBikes/reservedBike.service';
import { ReservedBike } from 'src/reservedBikes/reservedBikes.entity';
import { ReservedBikeModule } from 'src/reservedBikes/reservedBikes.module';
import { User } from 'src/users/user.entity';
import { UserController } from 'src/users/users.controller';
import { UserModule } from 'src/users/users.module';
import { UserService } from 'src/users/users.service';
import { Bike } from './bike.entity';
import { BikeController } from './bikes.controller';
import { BikeService } from './bikes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bike, User, ReservedBike, Comment])],
  controllers: [
    BikeController,
    UserController,
    ReservedBikeController,
    commentController,
  ],
  providers: [BikeService, UserService, ReservedBikeService, commentService],
})
export class BikeModule {}
