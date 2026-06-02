import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateVehicleInput } from './create-vehicle.input';
import { VehicleStatus } from '../entities/vehicule.entity';
import { IsEnum, IsOptional } from 'class-validator';

@InputType()
export class UpdateVehicleInput extends PartialType(CreateVehicleInput) {
  @Field(() => Int)
  id: number;

  @Field(() => VehicleStatus, { nullable: true })
  @IsOptional()
  @IsEnum(VehicleStatus)
  statut?: VehicleStatus;
}
