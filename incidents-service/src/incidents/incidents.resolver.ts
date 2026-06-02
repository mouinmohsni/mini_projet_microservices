import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { Incident } from './entities/incident.entity';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateIncidentStatusInput } from './dto/update-incident-status.input';

import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Incident)
export class IncidentsResolver {
  constructor(private readonly incidentsService: IncidentsService) {}

  // ---------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------

// methode cree
  @Mutation(() => Incident, {
    name: 'createIncident',
    description: 'Déclarer un nouvel incident',
  })
  @UseGuards(GqlAuthGuard, RolesGuard) // on a utiliser les garde pour verifier le token et pour recupere le role
  @Roles('ADMIN', 'OPERATOR') // Accessible à l'ADMIN et a l'OPERATOR
  createIncident(
    @Args('createIncidentInput') createIncidentInput: CreateIncidentInput,
    @CurrentUser() user: any, // On récupère User connecté grâce au token !
  ): Promise<Incident> {

    return this.incidentsService.createIncident(createIncidentInput, user.id);
  }

  // methode update
  @Mutation(() => Incident, {
    name: 'updateIncidentStatus',
    description: "Modifier le statut d'un incident",
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')//  Accessible à l'ADMIN et à l'OPERATOR
  updateIncidentStatus(
    @Args('updateIncidentStatusInput')
    updateIncidentStatusInput: UpdateIncidentStatusInput,
  ): Promise<Incident> {
    return this.incidentsService.updateIncidentStatus(
      updateIncidentStatusInput,
    );
  }

  // methode supprimer
  @Mutation(() => Boolean, {
    name: 'removeIncident',
    description: 'Supprimer un incident',
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN') //  Réservé à l'ADMIN
  removeIncident(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.incidentsService.removeIncident(id);
  }

  // ---------------------------------------------------------
  //  requet get
  // ---------------------------------------------------------

  //methode get all
  @Query(() => [Incident], {
    name: 'incidents',
    description: 'Consulter tous les incidents',
  })
  @UseGuards(GqlAuthGuard)
  // Accessible à tout utilisateur connecté on a pas des role
  findAllIncidents(): Promise<Incident[]> {
    return this.incidentsService.findAllIncidents();
  }

// methode get by id
  @Query(() => Incident, {
    name: 'incident',
    description: 'Consulter un incident spécifique',
  })
  @UseGuards(GqlAuthGuard)
  findOneIncident(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Incident> {
    return this.incidentsService.findOneIncident(id);
  }

  // ---------------------------------------------------------
  // FEDERATION
  // ---------------------------------------------------------

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<Incident> {
    return this.incidentsService.findOneIncident(reference.id);
  }
}
