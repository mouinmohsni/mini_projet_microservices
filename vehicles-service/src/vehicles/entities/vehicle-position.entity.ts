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
@ObjectType() // Décorateur GraphQL : crée un type "User" dans le schéma GraphQL
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
  @JoinColumn({ name: 'vehicleId' }) // C'est ça qui crée la vraie clé étrangère en base !
  @Field(() => Vehicule)
  vehicule: Vehicule;

  // On garde l'ID accessible facilement si on en a besoin
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
