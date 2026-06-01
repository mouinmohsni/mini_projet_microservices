import { Module } from '@nestjs/common';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { NotificationsModule } from './notifications/notifications.module'; // <-- On importe la branche !

@Module({
  imports: [
    // 1. Connexion à la base de données
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'notifs_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    // 2. Configuration de GraphQL en mode Subgraph (Federation)
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
    }),

    // 3. On attache la branche Notifications au tronc de l'application
    NotificationsModule,
  ],
  // On enlève les providers d'ici, ils sont déjà dans NotificationsModule !
})
export class AppModule {}
