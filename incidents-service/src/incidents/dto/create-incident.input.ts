import { InputType, Field , Int} from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IncidentType } from '../entities/incident.entity';

@InputType()
export class CreateIncidentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => IncidentType)
  @IsEnum(IncidentType)
  type: IncidentType;

  @Field(() => Int, { nullable: true })
  assigneeId?: number;
}
