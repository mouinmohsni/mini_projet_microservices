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

//  Les Enums
export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  TRAVAUX = 'TRAVAUX',
  ROUTE_FERMEE = 'ROUTE_FERMEE',
  EMBOUTEILLAGE = 'EMBOUTEILLAGE',
}

export enum IncidentStatus {
  SIGNALE = 'SIGNALE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
}

registerEnumType(IncidentType, { name: 'IncidentType' });
registerEnumType(IncidentStatus, { name: 'IncidentStatus' });

// 2. L'Entité
@Entity('incidents') //  le nom dans la base de donner
@ObjectType() // cree un insadant pour grapql
@Directive('@key(fields: "id")')
export class Incident {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  description: string;

  @Column({ type: 'enum', enum: IncidentType })
  @Field(() => IncidentType)
  type: IncidentType;

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.SIGNALE,
  })
  @Field(() => IncidentStatus)
  statut: IncidentStatus;

  //  L'ID du user qui a cree l'incident.
  @Column()
  @Field(() => Int)
  authorId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  assigneeId?: number;

}
