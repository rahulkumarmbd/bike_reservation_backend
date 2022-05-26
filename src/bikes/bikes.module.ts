import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserController } from 'src/users/users.controller';
import { UserService } from 'src/users/users.service';
import { Bike } from './bike.entity';
import { BikeController } from './bikes.controller';
import { BikeService } from './bikes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bike,User])],
  controllers: [BikeController,UserController],
  providers: [BikeService,UserService],
})
export class BikeModule {}
