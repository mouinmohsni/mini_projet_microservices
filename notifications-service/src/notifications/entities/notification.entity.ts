import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
@ObjectType()
@Directive('@key(fields: "id")')
export class Notification {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  message: string;

  @Column({ default: false })
  @Field()
  isRead: boolean;
  // L'ID de l'utilisateur qui a cree la notif

  @Column()
  @Field(() => Int)
  userId: number;
  // L'ID de l'utilisateur qui doit recevoir cette notification

  @Column()
  @Field(() => Int)
  receiverId: number;


  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  incidentId?: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
