import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';

// ⚠️ N'oublie pas que le dossier "auth" doit être présent dans ce service aussi !
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

export interface JwtUser {
  id: number;
  email: string;
  role: string;
}

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ---------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------

  // methode cree
  @Mutation(() => Notification, {
    name: 'createNotification',
    description: 'Envoyer une notification',
  })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    return this.notificationsService.create(createNotificationInput);
  }

 //methode pour marquer la notif comme lu
  @Mutation(() => Notification, {
    name: 'markNotificationAsRead',
    description: 'Marquer une notification comme lue',
  })
  @UseGuards(GqlAuthGuard)
  markNotificationAsRead(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtUser, //On récupère l'ID du User depuis le token
  ): Promise<Notification> {
    return this.notificationsService.markAsRead(id, user.id);
  }

  // ---------------------------------------------------------
  // QUERIES
  // ---------------------------------------------------------

  @Query(() => [Notification], {
    name: 'myNotifications',
    description: 'Consulter mes notifications',
  })
  @UseGuards(GqlAuthGuard)
  myNotifications(@CurrentUser() user: JwtUser): Promise<Notification[]> {
    return this.notificationsService.findAllForUser(user.id);
  }
}
