import { ReservedBike } from 'src/reservedBikes/reservedBikes.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Bike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  location: string;

  @Column({ default: 0 })
  avgRating: number;

  @Column()
  available: boolean;

  @OneToMany(() => ReservedBike, (reservedBike) => reservedBike.bikeId, {
    onDelete: 'CASCADE',
  })
  reservations: ReservedBike[];
}
