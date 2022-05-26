import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from './bike.entity';

export interface BikePaginate {
  bikes: Bike[];
  pages: number;
}

export interface filterBike {
  model: string;
  color: string;
  location: string;
  avgRating: string;
  page: number;
  limit: number;
}

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike) private bikesRepository: Repository<Bike>,
  ) {}

  async available(page: number, limit: number): Promise<BikePaginate> {
    const bikes = await this.bikesRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        available: true,
      },
    });

    const count = await this.bikesRepository.count();

    return { bikes: bikes, pages: Math.ceil(count / limit) };
  }

  async allBikes(): Promise<Bike[]> {
    return await this.bikesRepository.find();
  }

  async bike(id: number): Promise<Bike> {
    const bike = await this.bikesRepository.findOne({
      id: id,
      available: true,
    });
    if (bike) {
      return bike;
    }
    throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
  }

  createBike(bike: Bike): Promise<Bike> {
    const newBike = this.bikesRepository.create();
    return this.bikesRepository.save(bike);
  }

  async getOneById(id: number): Promise<Bike> {
    const bike = await this.bikesRepository.findOne(id);
    if (!bike)
      throw new HttpException('Invalid Bike ID', HttpStatus.BAD_REQUEST);
    return bike;
  }

  async updateBike(bike: Bike, id: number): Promise<Bike> {
    const oldBike = await this.getOneById(id);
    const updateUser = { ...oldBike, ...bike };
    return this.bikesRepository.save(updateUser);
  }

  async deleteBike(id: number): Promise<Bike> {
    console.log('deleteBike', id);
    const bike = await this.getOneById(id);
    return this.bikesRepository.remove(bike);
  }

  async filter(query: filterBike): Promise<BikePaginate> {
    const { page, limit, ...rest } = query;
    const bikes = await this.bikesRepository
      .createQueryBuilder()
      .where(
        'bike.model = :model OR bike.color = :color OR bike.location = :location OR bike.avgRating = :avgRating',
        rest,
      )
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    const filterBikes = await this.bikesRepository
      .createQueryBuilder()
      .where(
        'bike.model = :model OR bike.color = :color OR bike.location = :location OR bike.avgRating = :avgRating',
        rest,
      )
      .getMany();

    return { bikes: bikes, pages: Math.ceil(filterBikes.length / limit) };
  }
}
