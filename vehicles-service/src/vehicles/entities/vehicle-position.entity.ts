import { ObjectType, Field, Int, Directive, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicule } from './vehicule.entity';

//  La classe vehicule
@Entity('vehicle_positions')
@ObjectType()
@Directive('@key(fields: "id")')
export class VehiclePosition {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  latitude: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  longitude: number;

  @Column()
  @Field()
  timestamp: Date;

  // --- LA RELATION (Cette position appartient à un véhicule) ---
  @ManyToOne(() => Vehicule, (vehicule) => vehicule.positions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicleId' })
  @Field(() => Vehicule)
  vehicule: Vehicule;


  @Column()
  @Field(() => Int)
  vehicleId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
