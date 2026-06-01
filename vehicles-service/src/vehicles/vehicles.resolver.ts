import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicule } from './entities/vehicule.entity';
import { VehiclePosition } from './entities/vehicle-position.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { CreatePositionInput } from './dto/create-position.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { UpdateVehicleStatusInput } from './dto/update-vehicle-status.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Vehicule)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // ---------------------------------------------------------
  // MUTATIONS (Pour modifier ou ajouter des données)
  // ---------------------------------------------------------

  @Mutation(() => Vehicule, {
    name: 'createVehicle',
    description: 'Ajouter un nouveau véhicule',
  })
  createVehicle(
    @Args('createVehicleInput') createVehicleInput: CreateVehicleInput,
  ): Promise<Vehicule> {
    return this.vehiclesService.createVehicle(createVehicleInput);
  }

  @Mutation(() => VehiclePosition, {
    name: 'addPosition',
    description: 'Enregistrer une position GPS',
  })
  addPosition(
    @Args('createPositionInput') createPositionInput: CreatePositionInput,
  ): Promise<VehiclePosition> {
    return this.vehiclesService.addPosition(createPositionInput);
  }

  // ---------------------------------------------------------
  // QUERIES (Pour lire des données)
  // ---------------------------------------------------------

  @Query(() => [Vehicule], {
    name: 'vehicles',
    description: 'Consulter la liste des véhicules',
  })
  findAllVehicles(): Promise<Vehicule[]> {
    return this.vehiclesService.findAllVehicles();
  }

  @Query(() => Vehicule, {
    name: 'vehicle',
    description: "Consulter le détail d'un véhicule",
  })
  findOneVehicle(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Vehicule> {
    return this.vehiclesService.findOneVehicle(id);
  }

  // 🔒 SEUL L'ADMIN PEUT MODIFIER TOUT LE VÉHICULE

  @UseGuards(GqlAuthGuard, RolesGuard) // On active les deux videurs
  @Roles('ADMIN') // On exige le rôle ADMIN
  @Mutation(() => Vehicule, {
    name: 'updateVehicle',
    description: 'Modifier un véhicule existant',
  })
  updateVehicle(
    @Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput,
  ): Promise<Vehicule> {
    return this.vehiclesService.updateVehicle(
      updateVehicleInput.id,
      updateVehicleInput,
    );
  }

  // 🔓 L'OPÉRATEUR (et l'Admin) PEUT MODIFIER LE STATUT

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR') // Les deux rôles sont acceptés
  @Mutation(() => Vehicule, {
    name: 'updateVehicleStatus',
    description: 'Modifier uniquement le statut (Opérateur)',
  })
  updateVehicleStatus(
    @Args('updateVehicleStatusInput')
    updateVehicleStatusInput: UpdateVehicleStatusInput,
  ): Promise<Vehicule> {
    return this.vehiclesService.updateStatus(updateVehicleStatusInput);
  }

  // 🔒 SEUL L'ADMIN PEUT SUPPRIMER TOUT LE VÉHICULE

  @UseGuards(GqlAuthGuard, RolesGuard) // On active les deux videurs
  @Roles('ADMIN') // On exige le rôle ADMIN
  @Mutation(() => Boolean, {
    name: 'removeVehicle',
    description: 'Supprimer un véhicule',
  })
  removeVehicle(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.vehiclesService.removeVehicle(id);
  }

  // ---------------------------------------------------------
  // FEDERATION (Pour l'API Gateway)
  // ---------------------------------------------------------

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<Vehicule> {
    return this.vehiclesService.findOneVehicle(reference.id);
  }
}
