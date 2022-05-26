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
import { bikePatchSchema, bikeSchema } from './bike.schema';
import { RoleGuard } from 'src/AuthGuard/RoleGuard';
import { AuthGuard } from 'src/AuthGuard/AuthGuard';
import { Role } from 'src/userroles';
import { query } from 'express';

@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get()
  reservedBikes(): Promise<Bike[]> {
    return this.bikeService.allBikes();
  }

  @RoleGuard(Role.Manager, Role.Regular)
  @UseGuards(AuthGuard)
  @Get("filter")
  filter(
    @Query()
    query: filterBike,
  ): Promise<BikePaginate> {
    return this.bikeService.filter(query);
  }

  @RoleGuard(Role.Regular)
  @UseGuards(AuthGuard)
  @Get('available')
  unreserved(
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<BikePaginate> {
    return this.bikeService.available(+page, +limit);
  }

  @RoleGuard(Role.Regular, Role.Manager)
  @UseGuards(AuthGuard)
  @Get('/:id')
  bike(@Param('id') id: number): Promise<Bike> {
    return this.bikeService.bike(id);
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
  async updateUser(@Body() bike: Bike, @Param() id: number): Promise<Bike> {
    return this.bikeService.updateBike(bike, id);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUser(@Param() id: number): Promise<Bike> {
    return this.bikeService.deleteBike(id);
  }
}
