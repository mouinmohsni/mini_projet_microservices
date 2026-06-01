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

// 1. Définition des Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// On enregistre les Enums pour que GraphQL les comprenne
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(UserStatus, { name: 'UserStatus' });

// 2. La classe User
@Entity('users') // Décorateur TypeORM : crée une table "users" dans MySQL
@ObjectType() // Décorateur GraphQL : crée un type "User" dans le schéma GraphQL
@Directive('@key(fields: "id")')
export class User {
  @PrimaryGeneratedColumn() // TypeORM : Clé primaire auto-incrémentée
  @Field(() => Int) // GraphQL : Champ de type Entier
  id: number;

  @Column()
  @Field()
  nom: string;

  @Column()
  @Field()
  prenom: string;

  @Column({ unique: true }) // TypeORM : L'email doit être unique en base
  @Field()
  email: string;

  @Column()
  // ⚠️ ATTENTION SÉCURITÉ : Remarque bien qu'il n'y a PAS de décorateur @Field() ici !
  // Ainsi, TypeORM va bien sauvegarder le mot de passe en base,
  // mais GraphQL refusera de l'exposer si un client le demande.
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
