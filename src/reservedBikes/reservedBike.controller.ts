import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Param,
  Query,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/AuthGuard/AuthGuard';
import { RoleGuard } from 'src/AuthGuard/RoleGuard';
import { JoiValidationPipe } from 'src/joi-validation.pipes';
import { Role } from 'src/userroles';
import { Auth, IAuth } from 'src/utils/auth.decorator';
import { reservationSchema } from './reservedBike.schema';
import {
  ReservedBikeService,
  responseReservedBikes,
} from './reservedBike.service';
import { ReservedBike } from './reservedBikes.entity';

@Controller('reservedbike')
export class ReservedBikeController {
  constructor(private readonly reservedBikeService: ReservedBikeService) {}

  @Get()
  async getReservedBike(): Promise<ReservedBike[]> {
    return await this.reservedBikeService.getReservedBike();
  }

  @RoleGuard(Role.Regular, Role.Manager)
  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new JoiValidationPipe(reservationSchema))
  async reserveBike(
    @Body() bike: ReservedBike,
    @Auth() auth: IAuth,
  ): Promise<ReservedBike> {
    return await this.reservedBikeService.reserveBike(bike, auth);
  }

  @RoleGuard(Role.Regular, Role.Manager)
  @UseGuards(AuthGuard)
  @Get('user')
  async usersReservedBikes(
    @Auth() Auth: IAuth,
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<responseReservedBikes> {
    return await this.reservedBikeService.usersReservedBikes(
      Auth,
      +page,
      +limit,
    );
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get('user/:id')
  async getUserReserved(
    @Param('id') id: number,
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<responseReservedBikes> {
    return await this.reservedBikeService.getUserReserved(id, +page, +limit);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get('bike/:id')
  async getBikeReserved(
    @Param('id') id: number,
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<responseReservedBikes> {
    return await this.reservedBikeService.getBikeReserved(id, +page, +limit);
  }

  @RoleGuard(Role.Manager, Role.Regular)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async cancelReservation(
    @Param('id') id: number,
    @Auth() auth: IAuth,
  ): Promise<ReservedBike> {
    return await this.reservedBikeService.cancelReservation(id, auth);
  }


  @RoleGuard(Role.Manager, Role.Regular)
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getReservationById(
    @Param('id') id: number,
    @Auth() auth: IAuth,
  ): Promise<ReservedBike> {
    return await this.reservedBikeService.getReservationId(id, auth);
  }
}
