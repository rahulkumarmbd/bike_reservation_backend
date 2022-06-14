import { Bike } from 'src/bikes/bike.entity';
import { Comment } from 'src/comments/comment.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ReservedBike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingDate: Date;

  @Column()
  returnDate: Date;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne((type) => User, (user) => user.reservedBikesIds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Bike, (bike) => bike.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bike: Bike;

  @OneToOne((type) => Comment, (comment) => comment.reservation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  comment: Comment;
}
