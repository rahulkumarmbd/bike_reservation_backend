import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from 'src/bikes/bike.entity';
import { BikeService } from 'src/bikes/bikes.service';
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
    @InjectRepository(Bike)
    private bikeRepo: Repository<Bike>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async reserveBike(bike, auth: IAuth): Promise<ReservedBike> {
    const existingBike = await this.bikeRepo.findOne(bike.bikeId);
    if (!existingBike) {
      throw new HttpException('Invalid Bike ID', HttpStatus.BAD_REQUEST);
    }

    if (!existingBike.available) {
      throw new HttpException('Bike is not available', HttpStatus.BAD_REQUEST);
    }

    const ids = await this.getReservedBikesOfGivenTimePeriod(
      bike.bookingDate,
      bike.returnDate,
    );

    if (ids.includes(bike.bikeId)) {
      throw new HttpException(
        'Bike is not available for reservation',
        HttpStatus.BAD_REQUEST,
      );
    }

    const reservedBike = this.reservedBikeRepository.create({
      ...bike,
      bike: existingBike,
      user: auth.user,
    });

    if (!reservedBike) {
      throw new HttpException(
        'reserved bike not created due to error',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.reservedBikeRepository.save(reservedBike);
  }

  async getReservedBikesOfGivenTimePeriod(
    bookingDate: Date,
    returnDate: Date,
  ): Promise<Bike[]> {
    if (bookingDate > returnDate) {
      throw new HttpException(
        'Please check your booking date and return date again',
        HttpStatus.BAD_REQUEST,
      );
    }
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
    if (!page || page < 1 || !limit || limit < 1) {
      throw new HttpException(
        'Please check query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const allReservations = await this.reservedBikeRepository.find({
      relations: ['user', 'bike', 'comment'],
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
    if (!page || page < 1 || !limit || !id || limit < 1) {
      throw new HttpException(
        'Please check query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    const allReservations = await this.reservedBikeRepository.find({
      relations: ['user', 'bike', 'comment'],
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
    const existingBike = await this.bikeRepo.findOne(id);

    if (!existingBike) {
      throw new HttpException('Invalid Bike ID', HttpStatus.BAD_REQUEST);
    }

    const allReservations = await this.reservedBikeRepository.find({
      relations: ['user', 'bike', 'comment'],
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
      relations: ['user', 'comment'],
      where: { id },
    });

    if (!reservation)
      throw new HttpException('Invalid Reservation ID', HttpStatus.BAD_REQUEST);

    if (reservation.status !== 'active') {
      throw new HttpException(
        'You are trying to cancel a reservation which is already canceled',
        HttpStatus.BAD_REQUEST,
      );
    }

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
      relations: ['bike', 'user', 'comment'],
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

  async AddCommentId(reservationId: any, review: any) {
    const reservation = await this.reservedBikeRepository.findOne(
      reservationId,
    );
    if (!reservation)
      throw new HttpException('Invalid Reservation ID', HttpStatus.BAD_REQUEST);

    if (reservation.comment)
      throw new HttpException(
        'this reservation already have a review',
        HttpStatus.BAD_REQUEST,
      );

    return this.reservedBikeRepository.save({
      ...reservation,
      comment: review,
    });
  }
}
