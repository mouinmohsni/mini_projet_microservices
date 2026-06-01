import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateVehicleInput {
  @Field()
  @IsNotEmpty({ message: "L'immatriculation est requise" })
  @IsString()
  immatriculation: string;

  @Field()
  @IsNotEmpty({ message: 'La marque est requise' })
  @IsString()
  marque: string;

  @Field()
  @IsNotEmpty({ message: 'Le modèle est requis' })
  @IsString()
  modele: string;
}
