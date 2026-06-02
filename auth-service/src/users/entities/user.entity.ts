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

// Définition des Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// On enregistre les Enums pour GraphQL
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(UserStatus, { name: 'UserStatus' });

// 2. La classe User
@Entity('users') // Décorateur TypeORM
@ObjectType() // Décorateur GraphQL : crée un type "User" dans le schéma GraphQL
@Directive('@key(fields: "id")')
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  nom: string;

  @Column()
  @Field()
  prenom: string;

  @Column({ unique: true }) //  L'email doit être unique en base
  @Field()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.OPERATOR })
  @Field(() => UserRole)
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  @Field(() => UserStatus)
  statut: UserStatus;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
