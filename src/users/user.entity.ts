import { Comment } from 'src/comments/comment.entity';
import { ReservedBike } from 'src/reservedBikes/reservedBikes.entity';
import { Role } from 'src/userroles';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  phoneNumber: number;

  @Column({ default: Role.Regular })
  roles: Role;

  // @ManyToMany((type) => ReservedBike, (reservedbike) => reservedbike.users)
  // @JoinTable()
  // reservedBikesIds: string[];

  @OneToMany((type) => ReservedBike, (reservedbike) => reservedbike.user, {
    onDelete: 'CASCADE',
  })
  reservedBikesIds: ReservedBike[];

  @OneToMany((type) => Comment, (comment) => comment.user, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
