import { Bike } from 'src/bikes/bike.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ReservedBike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne((type) => User, (user) => user.reservedBikesIds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userId: User;

  @ManyToOne((type) => Bike, (bike) => bike.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bikeId: Bike;
}
