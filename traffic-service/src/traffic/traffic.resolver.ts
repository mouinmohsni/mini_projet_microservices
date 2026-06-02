import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficZone } from './entities/traffic-zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateDensityInput } from './dto/update-density.input';

// ⚠️ Assure-toi d'avoir copié le dossier "auth" (avec les guards et la stratégie JWT)
// depuis ton service véhicules vers ce service trafic !
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver(() => TrafficZone)
export class TrafficResolver {
  constructor(private readonly trafficService: TrafficService) {}

  // ---------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------


  @Mutation(() => TrafficZone, {
    name: 'createZone',
    description: 'Créer une nouvelle zone de trafic',
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createZone(
    @Args('createZoneInput') createZoneInput: CreateZoneInput,
  ): Promise<TrafficZone> {
    return this.trafficService.createZone(createZoneInput);
  }

  @Mutation(() => TrafficZone, {
    name: 'updateDensity',
    description: "Mettre à jour la densité d'une zone",
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  updateDensity(
    @Args('updateDensityInput') updateDensityInput: UpdateDensityInput,
  ): Promise<TrafficZone> {
    return this.trafficService.updateDensity(updateDensityInput);
  }

  @Mutation(() => Boolean, {
    name: 'removeZone',
    description: 'Supprimer une zone de trafic',
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeZone(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.trafficService.removeZone(id);
  }

  // ---------------------------------------------------------
  // QUERIES (Lecture)
  // ---------------------------------------------------------

  @Query(() => [TrafficZone], {
    name: 'zones',
    description: 'Consulter toutes les zones',
  })
  @UseGuards(GqlAuthGuard)
  findAllZones(): Promise<TrafficZone[]> {
    return this.trafficService.findAllZones();
  }

  @Query(() => TrafficZone, {
    name: 'zone',
    description: 'Consulter une zone spécifique',
  })
  @UseGuards(GqlAuthGuard)
  findOneZone(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TrafficZone> {
    return this.trafficService.findOneZone(id);
  }

  // ---------------------------------------------------------
  // FEDERATION (Pour l'API Gateway)
  // ---------------------------------------------------------

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<TrafficZone> {
    return this.trafficService.findOneZone(reference.id);
  }
}
