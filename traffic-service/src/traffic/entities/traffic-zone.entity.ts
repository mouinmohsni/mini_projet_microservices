import {
  ObjectType,
  Field,
  Int,
  registerEnumType,
  Directive,
} from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TrafficLevel {
  FAIBLE = 'FAIBLE',
  MOYEN = 'MOYEN',
  ELEVE = 'ELEVE',
}

registerEnumType(TrafficLevel, { name: 'TrafficLevel' });

@Entity('traffic_zones')
@ObjectType()
@Directive('@key(fields: "id")')
export class TrafficZone {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field()
  nom: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  densite: number; // Nombre de véhicules dans la zone

  @Column({ type: 'enum', enum: TrafficLevel, default: TrafficLevel.FAIBLE })
  @Field(() => TrafficLevel)
  niveau: TrafficLevel;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
