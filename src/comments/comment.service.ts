import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BikeService } from 'src/bikes/bikes.service';
import { ReservedBikeService } from 'src/reservedBikes/reservedBike.service';
import { IAuth } from 'src/utils/auth.decorator';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

export interface ResponseComments {
  comments: Comment[];
  pages: number;
}

@Injectable()
export class commentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private bikeRepository: BikeService,
    private reservedBikeRepository: ReservedBikeService,
  ) {}

  async addComment(
    id: number,
    auth: IAuth,
    review: Comment,
    page: number,
    limit: number,
  ): Promise<ResponseComments> {
    const { reservation, ...rest } = review;

    const bike = await this.bikeRepository.getOneById(id);

    if (!bike) {
      throw new HttpException('Bike not found', HttpStatus.BAD_REQUEST);
    }

    const Reservation = await this.reservedBikeRepository.getReservationId(
      +reservation,
      auth,
    );

    if (!Reservation) {
      throw new HttpException('Reservation not found', HttpStatus.BAD_REQUEST);
    }

    const Review = this.commentRepository.create({
      ...rest,
      user: auth.user,
      bike: bike,
      reservation: Reservation,
    });

    if (!Review) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }

    const savedReview = await this.commentRepository.save(Review);

    return await this.getReviews(id, page, limit, true);
  }

  async getReviews(
    id: number,
    page: number,
    limit: number,
    isAdded?: boolean,
  ): Promise<ResponseComments> {
    if(!id || !page || !limit){
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }
    const bike = await this.bikeRepository.getOneById(id);
    if (isAdded) {
      const allReviews = await this.commentRepository.find({
        where: { bike: bike },
      });
      if (allReviews.length > 0) {
        const updateBike = await this.bikeRepository.updateBike(
          {
            ...bike,
            avgRating:
              allReviews.reduce((a, b) => a + b.rating, 0) / allReviews.length,
          },
          id,
        );
      }
    }
    const count = await this.commentRepository.count({
      where: { bike: bike },
    });

    const comments = await this.commentRepository.find({
      where: { bike: bike },
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { comments, pages: Math.ceil(count / limit) };
  }
}
