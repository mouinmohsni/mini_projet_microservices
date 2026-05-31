import { ObjectType, Field, Int, registerEnumType ,Directive } from '@nestjs/graphql';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import {VehiclePosition} from "./vehicle-position.entity";


export enum VehicleStatus  {
    EN_ROUTE = 'EN_ROUTE',
    A_L_ARRET = 'A_L_ARRET',
    EN_PANNE ="EN_PANNE"
}


// On enregistre les Enums pour que GraphQL les comprenne
registerEnumType(VehicleStatus, { name: 'VehicleStatus' });
//  La classe vehicule
@Entity('vehicules') // Décorateur TypeORM : crée une table "users" dans MySQL
@ObjectType() // Décorateur GraphQL : crée un type "User" dans le schéma GraphQL
@Directive('@key(fields: "id")')
export class Vehicule {

    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ unique: true })
    @Field()
    immatriculation : string;

    @Column()
    @Field()
    marque : string;

    @Column()
    @Field()
    modele : string;



    @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.EN_ROUTE })
    @Field(() => VehicleStatus)
    statut: VehicleStatus;

    // --- LA RELATION (Un véhicule a plusieurs positions) ---
    @OneToMany(() => VehiclePosition, (position) => position.vehicule)
    @Field(() => [VehiclePosition], { nullable: true }) // Un tableau de positions
    positions: VehiclePosition[];


    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}
