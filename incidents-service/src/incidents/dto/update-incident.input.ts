import { InputType, Field, Int } from '@nestjs/graphql';
import { IncidentType, IncidentStatus } from '../entities/incident.entity'; // Vérifie juste que le chemin est bon

@InputType()
export class UpdateIncidentInput {
    @Field(() => Int)
    id: number;

    @Field({ nullable: true })
    description?: string;

    @Field(() => IncidentType, { nullable: true })
    type?: IncidentType;

    @Field(() => IncidentStatus, { nullable: true })
    statut?: IncidentStatus;

    @Field(() => Int, { nullable: true })
    assigneeId?: number;
}
