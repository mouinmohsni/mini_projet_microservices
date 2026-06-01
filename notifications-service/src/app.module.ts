import { Module } from '@nestjs/common';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsResolver } from './notifications/notifications.resolver';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // ⚠️ Remplace par ton utilisateur MySQL
      password: 'root', // ⚠️ Remplace par ton mot de passe MySQL
      database: 'notifs_db', // La base que tu as créée dans Workbench
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Crée les tables automatiquement (pratique en dev)
    }),

    // 2. Configuration de GraphQL en mode Subgraph (Federation)
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 }, // Génère le schéma automatiquement
    }),
  ],
  providers: [NotificationsResolver, NotificationsService, JwtStrategy],
  exports: [NotificationsService],
})
export class AppModule {}
