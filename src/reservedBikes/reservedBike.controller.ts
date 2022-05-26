import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from 'src/AuthGuard/AuthGuard';
import { RoleGuard } from 'src/AuthGuard/RoleGuard';
import { Role } from 'src/userroles';
import { Auth, IAuth } from 'src/utils/auth.decorator';
import { ReservedBikeService } from './reservedBike.service';
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
  async getUserByToken(
    @Body() bike: ReservedBike,
    @Auth() auth: IAuth,
  ): Promise<any> {
    return await this.reservedBikeService.reservedBike(bike, auth);
  }

  @RoleGuard(Role.Regular, Role.Manager)
  @UseGuards(AuthGuard)
  @Get('user')
  async usersReservedBikes(@Auth() Auth: IAuth): Promise<ReservedBike[]> {
    return await this.reservedBikeService.usersReservedBikes(Auth);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get('user/:id')
  async getUserReserved(@Param('id') id: number): Promise<ReservedBike[]> {
    return await this.reservedBikeService.getUserReserved(id);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get('bike/:id')
  async getBikeReserved(@Param('id') id: number): Promise<ReservedBike[]> {
    return await this.reservedBikeService.getBikeReserved(id);
  }
}
