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
  user: responseUser;
}

export interface usersPaginate {
  users: responseUser[];
  pages: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAll(page: number, limit: number): Promise<usersPaginate> {
    const users = await this.usersRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      order: { id: 'DESC' },
    });

    const count = await this.usersRepository.count();

    return { users: users, pages: Math.ceil(count / limit) };
  }

  async createUser(user: User): Promise<responseUser> {
    const hashPassword = bcrypt.hashSync(user.password, 8);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async loggedUser(user: User): Promise<tokenObject> {
    const existingUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: user.email })
      .addSelect('user.password')
      .getOne();

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

    return { message: 'login successful', token, user: existingUser };
  }

  async getOneById(id: number): Promise<responseUser> {
    const user = await this.usersRepository.findOne(id);
    if (!user)
      throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);
    return user;
  }

  async updateUser(user: User, id: number): Promise<responseUser> {
    const oldUser = await this.usersRepository.findOne(id);
    if (!oldUser)
      throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);

    if (user.email && user.email !== oldUser.email) {
      const haveUser = await this.usersRepository.findOne(user.email);
      if (haveUser) {
        throw new HttpException('Email is not unique', HttpStatus.BAD_REQUEST);
      }
    }

    if (user.password) {
      const hashPassword = bcrypt.hashSync(user.password, 8);
      user = { ...user, password: hashPassword };
    }
    const updateUser = { ...oldUser, ...user };
    return await this.usersRepository.save(updateUser);
  }

  async deleteUser(id: number): Promise<responseUser> {
    const user = await this.usersRepository.findOne(id);
    if (!user)
      throw new HttpException('Invalid User ID', HttpStatus.BAD_REQUEST);
    return await this.usersRepository.remove(user);
  }
}
