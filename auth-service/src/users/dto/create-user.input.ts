import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
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
  @IsEmail({}, { message: "L'email doit être valide" })
  email: string;

  @Field()
  @IsString()
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

}
