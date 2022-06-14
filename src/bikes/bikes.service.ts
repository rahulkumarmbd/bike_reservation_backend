import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservedBikeService } from 'src/reservedBikes/reservedBike.service';
import { In, Not, Repository } from 'typeorm';
import { Bike } from './bike.entity';
import { NonReserved } from './bikes.controller';

export interface BikePaginate {
  bikes: Bike[];
  pages: number;
}

export interface filterBike {
  model?: string;
  color?: string;
  location?: string;
  avgRating?: string;
  page: number;
  limit: number;
}

const helperObj = (rest: {
  model?: string;
  color?: string;
  location?: string;
  avgRating?: string;
}) => {
  let obj = {};
  for (let key in rest) {
    if (rest[key]) {
      obj[key] = rest[key];
    }
  }
  return obj;
};

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike) private bikesRepository: Repository<Bike>,
    private readonly reservedBikeService: ReservedBikeService,
  ) {}
  // for regular users
  async available(page: number, limit: number): Promise<BikePaginate> {
    if (!page || !limit || page < 1 || limit < 1) {
      throw new HttpException(
        'please check your query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }
    const bikes = await this.bikesRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        available: true,
      },
      order: { id: 'DESC' },
    });

    const count = await this.bikesRepository.count({
      where: {
        available: true,
      },
    });

    return { bikes: bikes, pages: Math.ceil(count / limit) };
  }

  // available bikes for specific period of time
  async nonreserved(query: NonReserved): Promise<BikePaginate> {
    let { page, limit, bookingDate, returnDate, ...rest } = query;
    page = +page;
    limit = +limit;
    if (!page || !limit || page < 1 || limit < 1) {
      throw new HttpException(
        'please check your query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (bookingDate > returnDate) {
      throw new HttpException(
        'Invalid period of booking',
        HttpStatus.BAD_REQUEST,
      );
    }

    const obj = helperObj(rest);

    const ids =
      await this.reservedBikeService.getReservedBikesOfGivenTimePeriod(
        bookingDate,
        returnDate,
      );

    const bikes = await this.bikesRepository.find({
      where: { id: Not(In(ids)), available: true, ...obj },
      take: limit,
      skip: (page - 1) * limit,
      order: { id: 'DESC' },
    });

    const count = await this.bikesRepository.count({
      where: { id: Not(In(ids)), available: true, ...obj },
    });

    return { bikes: bikes, pages: Math.ceil(count / limit) };
  }

  // for manager
  async allBikes(page: number, limit: number): Promise<BikePaginate> {
    if (!page || !limit || page < 1 || limit < 1) {
      throw new HttpException(
        'Please check your query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bikes = await this.bikesRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      order: { id: 'DESC' },
    });

    const count = await this.bikesRepository.count();

    return { bikes: bikes, pages: Math.ceil(count / limit) };
  }

  // for regular users
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
    const newBike = this.bikesRepository.create(bike);
    if (!newBike)
      throw new HttpException(
        'New Bike not created due to error',
        HttpStatus.BAD_REQUEST,
      );
    return this.bikesRepository.save(newBike);
  }

  // for manager
  async getBikeById(id: number): Promise<Bike> {
    const bike = await this.bikesRepository.findOne({
      where: { id: id },
    });

    if (!bike)
      throw new HttpException('Invalid Bike ID', HttpStatus.BAD_REQUEST);
    return bike;
  }

  async updateBike(bike: Bike, id: number): Promise<Bike> {
    const oldBike = await this.bikesRepository.findOne(id);
    if (!bike || !oldBike)
      throw new HttpException('Details not found', HttpStatus.BAD_REQUEST);
      
    const updateUser = { ...oldBike, ...bike };
    return this.bikesRepository.save(updateUser);
  }

  async deleteBike(id: number): Promise<Bike> {
    console.log("bike",id);
    const bike = await this.getBikeById(id);
    console.log(bike);
    if (!bike)
      throw new HttpException('Invalid Bike ID', HttpStatus.BAD_REQUEST);
    
    return this.bikesRepository.remove(bike);
  }

  async filter(query: filterBike): Promise<BikePaginate> {
    const { page, limit, ...rest } = query;
    
    if (!page || !limit || page < 1 || limit < 1) {
      throw new HttpException(
        'please check your query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    let obj = helperObj(rest);

    const bikes = await this.bikesRepository.find({
      where: obj,
      take: limit,
      skip: (page - 1) * limit,
      order: { id: 'DESC' },
    });

    const count = await this.bikesRepository.count({
      where: obj,
    });

    return { bikes: bikes, pages: Math.ceil(count / limit) };
  }
}
