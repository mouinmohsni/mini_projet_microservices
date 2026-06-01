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

  // L'ID de l'utilisateur qui doit recevoir cette notification
  @Column()
  @Field(() => Int)
  userId: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
