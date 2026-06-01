import { InputType, Field } from '@nestjs/graphql';
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
}
