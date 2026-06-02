import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;


  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  receiverId: number; // Celui qui reçoit

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  incidentId?: number;
}
