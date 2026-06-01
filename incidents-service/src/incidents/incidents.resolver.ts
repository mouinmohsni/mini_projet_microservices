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

// ⚠️ Assure-toi d'avoir bien copié le dossier "auth" dans ce service aussi !
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

  // 🔓 Accessible à l'ADMIN et à l'OPERATOR
  @Mutation(() => Incident, {
    name: 'createIncident',
    description: 'Déclarer un nouvel incident',
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  createIncident(
    @Args('createIncidentInput') createIncidentInput: CreateIncidentInput,
    @CurrentUser() user: any, // <-- MAGIE : On récupère l'utilisateur connecté grâce au token !
  ): Promise<Incident> {
    // On passe les infos de l'incident ET l'ID de l'utilisateur au service
    return this.incidentsService.createIncident(createIncidentInput, user.id);
  }

  // 🔓 Accessible à l'ADMIN et à l'OPERATOR
  @Mutation(() => Incident, {
    name: 'updateIncidentStatus',
    description: "Modifier le statut d'un incident",
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  updateIncidentStatus(
    @Args('updateIncidentStatusInput')
    updateIncidentStatusInput: UpdateIncidentStatusInput,
  ): Promise<Incident> {
    return this.incidentsService.updateIncidentStatus(
      updateIncidentStatusInput,
    );
  }

  // 🔒 Réservé à l'ADMIN
  @Mutation(() => Boolean, {
    name: 'removeIncident',
    description: 'Supprimer un incident',
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeIncident(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.incidentsService.removeIncident(id);
  }

  // ---------------------------------------------------------
  // QUERIES
  // ---------------------------------------------------------

  // 🟢 Accessible à tout utilisateur connecté
  @Query(() => [Incident], {
    name: 'incidents',
    description: 'Consulter tous les incidents',
  })
  @UseGuards(GqlAuthGuard)
  findAllIncidents(): Promise<Incident[]> {
    return this.incidentsService.findAllIncidents();
  }

  // 🟢 Accessible à tout utilisateur connecté
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
