import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { IAuth } from 'src/utils/auth.decorator';
import { Repository } from 'typeorm';
import { ReservedBike } from './reservedBikes.entity';

@Injectable()
export class ReservedBikeService {
  constructor(
    @InjectRepository(ReservedBike)
    private reservedBikeRepository: Repository<ReservedBike>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async reservedBike(bike, auth: IAuth) {
    const reservedBike = this.reservedBikeRepository.create({
      ...bike,
      userId: auth.user,
    });

    return await this.reservedBikeRepository.save(reservedBike);

    // const reservedBikes = this.reservedBikeRepository.create({...rest,users:[user]});
    // reservedBikes.users = [data.users];

    // const user = await this.userRepository.findOne(data.users);

    // if (!user) {
    //   throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    // }

    // const reservedBikes = new ReservedBike();
    // reservedBikes.endTime = data.endTime;
    // reservedBikes.startTime = data.startTime;
    // reservedBikes.users = [user];
    // return await this.reservedBikeRepository.save(reservedBikes);
  }

  async getReservedBike() {
    const allReservations = await this.reservedBikeRepository.find({
      relations: ['userId', 'bikeId'],
    });

    return allReservations;
  }

  async usersReservedBikes(Auth: IAuth) {
    const allReservations = await this.reservedBikeRepository.find({
      relations: ['userId', 'bikeId'],
      where: { userId: Auth.user.id },
      order: { id: 'DESC' },
    });

    return allReservations;
  }

  async getUserReserved(id: number) {
    return await this.reservedBikeRepository.find({
      relations: ['userId', 'bikeId'],
      where: { userId: id },
      order: { id: 'DESC' },
    });
  }

  async getBikeReserved(id: number) {
    return await this.reservedBikeRepository.find({
      relations: ['userId', 'bikeId'],
      where: { bikeId: id },
      order: { id: 'DESC' },
    });
  }
}
