import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  UsePipes,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/joi-validation.pipes';
import { BikePaginate, BikeService, filterBike } from './bikes.service';
import { Bike } from './bike.entity';
import {
  bikePatchSchema,
  bikeSchema,
  filterSchema,
  idSchema,
  limitAndPageSchema,
  nonReservedSchema,
} from './bike.schema';
import { RoleGuard } from 'src/AuthGuard/RoleGuard';
import { AuthGuard } from 'src/AuthGuard/AuthGuard';
import { Role } from 'src/userroles';

export interface NonReserved {
  page: number;
  limit: number;
  bookingDate: Date;
  returnDate: Date;
  model?: string;
  color?: string;
  avgRating?: string;
  location?: string;
}

@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get()
  @UsePipes(new JoiValidationPipe(limitAndPageSchema))
  reservedBikes(
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<BikePaginate> {
    return this.bikeService.allBikes(+page, +limit);
  }

  @RoleGuard(Role.Manager, Role.Regular)
  @UseGuards(AuthGuard)
  @Get('filter')
  @UsePipes(new JoiValidationPipe(filterSchema))
  filter(
    @Query()
    query: filterBike,
  ): Promise<BikePaginate> {
    return this.bikeService.filter(query);
  }

  @RoleGuard(Role.Regular, Role.Manager)
  @UseGuards(AuthGuard)
  @Get('nonreserved')
  @UsePipes(new JoiValidationPipe(nonReservedSchema))
  nonreserved(
    @Query()
    query: NonReserved,
  ): Promise<BikePaginate> {
    return this.bikeService.nonreserved(query);
  }

  @RoleGuard(Role.Regular)
  @UseGuards(AuthGuard)
  @Get('available')
  @UsePipes(new JoiValidationPipe(limitAndPageSchema))
  unreserved(
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<BikePaginate> {
    return this.bikeService.available(+page, +limit);
  }

  @RoleGuard(Role.Regular)
  @UseGuards(AuthGuard)
  @Get('/:id')
  @UsePipes(new JoiValidationPipe(idSchema))
  AvialableBike(@Param() { id }: { id: number }): Promise<Bike> {
    return this.bikeService.bike(id);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get('/:id/manager')
  @UsePipes(new JoiValidationPipe(idSchema))
  getBike(@Param() { id }: { id: number }): Promise<Bike> {
    return this.bikeService.getBikeById(id);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new JoiValidationPipe(bikeSchema))
  async createBike(@Body() bike: Bike): Promise<Bike> {
    return await this.bikeService.createBike(bike);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UsePipes(new JoiValidationPipe(bikePatchSchema))
  async updateUser(@Body() bike: Bike, @Param() {id}: {id:number}): Promise<Bike> {
    return this.bikeService.updateBike(bike, id);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  @UsePipes(new JoiValidationPipe(idSchema))
  async deleteUser(@Param() { id }: { id: number }): Promise<Bike> {
    return this.bikeService.deleteBike(id);
  }
}
