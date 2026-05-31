import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType() // Indique à GraphQL que c'est un objet de données en entrée
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
    nom: string;

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Le prénom ne peut pas être vide' })
    prenom: string;

    @Field()
    @IsEmail({}, { message: 'L\'email doit être valide' })
    email: string;

    @Field()
    @IsString()
    @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
    password: string;

    // Note : On ne demande pas le "role" ni le "statut" ici.
    // Par défaut, un nouvel inscrit sera "OPERATOR" et "ACTIVE" (géré par l'entité).
}
