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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from 'src/AuthGuard/AuthGuard';
import { RoleGuard } from 'src/AuthGuard/RoleGuard';
import { JoiValidationPipe } from 'src/joi-validation.pipes';
import { Role } from 'src/userroles';
import { Auth, IAuth } from 'src/utils/auth.decorator';
import {
  idAndPaginationSchema,
  idSchema,
  paginationSchema,
  reservationSchema,
} from './reservedBike.schema';
import {
  ReservedBikeService,
  responseReservedBikes,
} from './reservedBike.service';
import { ReservedBike } from './reservedBikes.entity';

@Controller('reservedbike')
export class ReservedBikeController {
  constructor(private readonly reservedBikeService: ReservedBikeService) {}

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
  @UsePipes(new JoiValidationPipe(paginationSchema))
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
  @UsePipes(new JoiValidationPipe(idAndPaginationSchema))
  async getUserReserved(
    @Param() { id }: { id: number },
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<responseReservedBikes> {
    if (!id || !page || !limit) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }
    return await this.reservedBikeService.getUserReserved(id, +page, +limit);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get('bike/:id')
  @UsePipes(new JoiValidationPipe(idAndPaginationSchema))
  async getBikeReserved(
    @Param('id') id: number,
    @Query() { page, limit }: { page: string; limit: string },
  ): Promise<responseReservedBikes> {
    if (!id || !page || !limit) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }
    return await this.reservedBikeService.getBikeReserved(id, +page, +limit);
  }

  @RoleGuard(Role.Manager, Role.Regular)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UsePipes(new JoiValidationPipe(idSchema))
  async cancelReservation(
    @Param() { id }: { id: number },
    @Auth() auth: IAuth,
  ): Promise<ReservedBike> {
    return await this.reservedBikeService.cancelReservation(id, auth);
  }

  @RoleGuard(Role.Manager, Role.Regular)
  @UseGuards(AuthGuard)
  @Get('/:id')
  @UsePipes(new JoiValidationPipe(idSchema))
  async getReservationById(
    @Param() { id }: { id: number },
    @Auth() auth: IAuth,
  ): Promise<ReservedBike> {
    return await this.reservedBikeService.getReservationId(id, auth);
  }
}
