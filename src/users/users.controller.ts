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
} from '@nestjs/common';
import { responseUser, UserService } from './users.service';
import { User } from './user.entity';
import { JoiValidationPipe } from 'src/joi-validation.pipes';
import {
  userJwtToken,
  userLoginSchema,
  userPatchSchema,
  userSchema,
} from './user.schema';
import { AuthGuard } from 'src/AuthGuard/AuthGuard';
import { Auth, IAuth } from 'src/utils/auth.decorator';
import { RoleGuard } from 'src/AuthGuard/RoleGuard';
import { Role } from 'src/userroles';

interface tokenObject {
  token: string;
}

interface Register {
  message: string;
  user: responseUser;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @RoleGuard(Role.Regular)
  @UseGuards(AuthGuard)
  @Get('/helloWorld')
  get(@Auth() Auth: IAuth) {
    console.log('Auth', Auth.user.email);
    return this.userService.getHello();
  }

  @Post('/register')
  @UsePipes(new JoiValidationPipe(userSchema))
  async createUser(@Body() user: User): Promise<Register> {
    const newUser = await this.userService.createUser(user);
    return { message: 'Registration successful', user: newUser };
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(userLoginSchema))
  async loggedUser(@Body() user: User): Promise<tokenObject> {
    return await this.userService.loggedUser(user);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getOneById(@Param() id: number): Promise<responseUser> {
    return await this.userService.getOneById(id);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  @UsePipes(new JoiValidationPipe(userPatchSchema))
  async updateUser(
    @Body() user: User,
    @Param() id: number,
  ): Promise<responseUser> {
    return await this.userService.updateUser(user, id);
  }

  @RoleGuard(Role.Manager)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUser(@Param() id: number): Promise<responseUser> {
    return await this.userService.deleteUser(id);
  }
}
