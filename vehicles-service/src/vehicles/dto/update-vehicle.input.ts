import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateVehicleInput } from './create-vehicle.input';
import { VehicleStatus } from '../entities/vehicule.entity';
import { IsEnum, IsOptional } from 'class-validator';

@InputType()
export class UpdateVehicleInput extends PartialType(CreateVehicleInput) {
  @Field(() => Int)
  id: number; // L'ID est obligatoire pour savoir qui on modifie

  @Field(() => VehicleStatus, { nullable: true })
  @IsOptional()
  @IsEnum(VehicleStatus)
  statut?: VehicleStatus;
}
