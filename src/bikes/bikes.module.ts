import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservedBikeController } from 'src/reservedBikes/reservedBike.controller';
import { ReservedBikeService } from 'src/reservedBikes/reservedBike.service';
import { ReservedBike } from 'src/reservedBikes/reservedBikes.entity';
import { User } from 'src/users/user.entity';
import { UserController } from 'src/users/users.controller';
import { UserService } from 'src/users/users.service';
import { Bike } from './bike.entity';
import { BikeController } from './bikes.controller';
import { BikeService } from './bikes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bike, User, ReservedBike])],
  controllers: [BikeController, UserController, ReservedBikeController],
  providers: [BikeService, UserService, ReservedBikeService],
})
export class BikeModule {}
