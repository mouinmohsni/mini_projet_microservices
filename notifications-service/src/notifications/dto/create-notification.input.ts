import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
