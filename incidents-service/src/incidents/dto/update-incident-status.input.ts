import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IncidentStatus } from '../entities/incident.entity';

@InputType()
export class UpdateIncidentStatusInput {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field(() => IncidentStatus)
  @IsEnum(IncidentStatus)
  statut: IncidentStatus;
}
