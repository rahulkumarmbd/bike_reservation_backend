import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as env from 'dotenv';
import { Role } from 'src/userroles';
env.config();

// console.log(process.env.JWT_PRIVATE_KEY)


export interface responseUser {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: number;
  roles: Role;
}

export interface tokenObject {
  message: string;
  token: string;
  user: responseUser
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAll(): Promise<responseUser[]> {
    return await this.usersRepository
      .createQueryBuilder()
      .select(['fullName', 'email', 'roles', 'phoneNumber', 'id'])
      .execute();
  }

  getHello(): string {
    return 'Hello Rahul';
  }

  async createUser(user: User): Promise<responseUser> {
    const hashPassword = bcrypt.hashSync(user.password, 8);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashPassword,
    });
    const { password, ...createdUser } = await this.usersRepository.save(
      newUser,
    );
    return createdUser;
  }

  async loggedUser(user: User): Promise<tokenObject> {
    const existingUser = await this.usersRepository.findOne({
      email: user.email,
    });

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const match = bcrypt.compareSync(user.password, existingUser.password);
    if (!match)
      throw new HttpException(
        "Email or Password doesn't match",
        HttpStatus.BAD_REQUEST,
      );

    const token = jwt.sign(
      { id: existingUser.id, time: Date.now() },
      process.env.JWT_PRIVATE_KEY,
    );

    const {password , ...rest} = existingUser;

    return { message: 'login successful', token ,user: rest};;
  }

  async getOneById(id: number): Promise<responseUser> {
    const user = await this.usersRepository.findOne(id);
    if (!user)
      throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);
    const { password, ...rest } = user;
    return rest;
  }

  async updateUser(user: User, id: number): Promise<responseUser> {
    const oldUser = await this.usersRepository.findOne(id);
    if (!oldUser)
      throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);

    if (user.password) {
      const hashPassword = bcrypt.hashSync(user.password, 8);
      user = { ...user, password: hashPassword };
    }
    const updateUser = { ...oldUser, ...user };
    const { password, ...rest } = await this.usersRepository.save(updateUser);
    return rest;
  }

  async deleteUser(id: number): Promise<responseUser> {
    const user = await this.usersRepository.findOne(id);
    if (!user)
      throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);
    const { password, ...rest } = await this.usersRepository.remove(user);
    return rest;
  }
}
