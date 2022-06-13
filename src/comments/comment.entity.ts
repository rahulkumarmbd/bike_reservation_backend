import { Bike } from 'src/bikes/bike.entity';
import { ReservedBike } from 'src/reservedBikes/reservedBikes.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  time: string;

  @Column()
  userName: string;

  @Column({ default: 0 })
  rating: number;

  @Column()
  model: string;

  @ManyToOne((type) => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Bike, (bike) => bike.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bike: Bike;

  @ManyToOne((type) => ReservedBike, (reservation) => reservation.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  reservation: ReservedBike;
}
