import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/bike.entity';
import { User } from 'src/users/user.entity';
import { IAuth } from 'src/utils/auth.decorator';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ReservedBike } from './reservedBikes.entity';

export interface responseReservedBikes {
  allReservations: ReservedBike[];
  pages: number;
}

@Injectable()
export class ReservedBikeService {
  constructor(
    @InjectRepository(ReservedBike)
    private reservedBikeRepository: Repository<ReservedBike>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async reserveBike(bike, auth: IAuth): Promise<ReservedBike> {
    const reservedBike = this.reservedBikeRepository.create({
      ...bike,
      bike: bike.bikeId,
      user: auth.user,
    });

    return await this.reservedBikeRepository.save(reservedBike);
  }

  async getReservedBike(): Promise<ReservedBike[]> {
    const allReservations = await this.reservedBikeRepository.find({
      relations: ['user', 'bike'],
    });

    return allReservations;
  }

  async getReservedBikesOfGivenTimePeriod(
    bookingDate: Date,
    returnDate: Date,
  ): Promise<Bike[]> {
    const newbookingDate = `${bookingDate} 00:00:00.000`;
    const newreturnDate = `${returnDate} 00:00:00.000`;
    let ids = await this.reservedBikeRepository.find({
      loadRelationIds: true,
      where: [
        {
          bookingDate: Between(newbookingDate, newreturnDate),
          status: 'active',
        },
        {
          bookingDate: LessThanOrEqual(newbookingDate),
          returnDate: MoreThanOrEqual(newreturnDate),
          status: 'active',
        },
        {
          returnDate: Between(newbookingDate, newreturnDate),
          status: 'active',
        },
      ],
      select: ['bike', 'status'],
    });
    return [...new Set(ids.map((id) => id.bike))];
  }

  async usersReservedBikes(
    Auth: IAuth,
    page: number,
    limit: number,
  ): Promise<responseReservedBikes> {
    const allReservations = await this.reservedBikeRepository.find({
      relations: ['user', 'bike'],
      where: { user: Auth.user.id },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const count = await this.reservedBikeRepository.count({
      where: { user: Auth.user.id },
    });

    return { allReservations, pages: Math.ceil(count / limit) };
  }

  async getUserReserved(
    id: number,
    page: number,
    limit: number,
  ): Promise<responseReservedBikes> {
    const allReservations = await this.reservedBikeRepository.find({
      relations: ['user', 'bike'],
      where: { user: id },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const count = await this.reservedBikeRepository.count({
      where: { user: id },
    });

    return { allReservations, pages: Math.ceil(count / limit) };
  }

  async getBikeReserved(
    id: number,
    page: number,
    limit: number,
  ): Promise<responseReservedBikes> {
    const allReservations = await this.reservedBikeRepository.find({
      relations: ['user', 'bike'],
      where: { bike: id },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const count = await this.reservedBikeRepository.count({
      where: { bike: id },
    });

    return { allReservations, pages: Math.ceil(count / limit) };
  }

  async cancelReservation(id: number, auth: IAuth): Promise<ReservedBike> {
    const reservation = await this.reservedBikeRepository.findOne({
      relations: ['user'],
      where: { id },
    });

    if (reservation.status !== 'active') {
      throw new HttpException('It is not active', HttpStatus.BAD_REQUEST);
    }

    if (!reservation)
      throw new HttpException('Invalid Reservation ID', HttpStatus.BAD_REQUEST);

    if (reservation.user.id !== auth.user.id) {
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }

    return await this.reservedBikeRepository.save({
      ...reservation,
      status: 'canceled',
    });
  }

  async getReservationId(id: number, auth: IAuth): Promise<ReservedBike> {
    const reservation = await this.reservedBikeRepository.findOne({
      relations: ['bike', 'user'],
      where: { id, status: 'active' },
    });

    if (!reservation) {
      throw new HttpException(
        'Bad reservation Request',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (auth.user.id !== reservation.user.id) {
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }

    return reservation;
  }
}
