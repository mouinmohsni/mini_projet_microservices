import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreatePositionInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number; // On doit savoir à quel véhicule appartient cette position

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
