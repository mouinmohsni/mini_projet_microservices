import { InputType, Field, Int } from '@nestjs/graphql';
import { VehicleStatus } from '../entities/vehicule.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateVehicleStatusInput {
    @Field(() => Int)
    @IsNotEmpty()
    id: number;

    @Field(() => VehicleStatus)
    @IsEnum(VehicleStatus)
    statut: VehicleStatus;
}
