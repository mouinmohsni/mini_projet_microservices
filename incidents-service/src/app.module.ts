import { Module } from '@nestjs/common';
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import {TypeOrmModule} from "@nestjs/typeorm";
import {GraphQLModule} from "@nestjs/graphql";
import { IncidentsModule } from './incidents/incidents.module';


@Module({
  imports: [
  // 1. Configuration de la base de données
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root', // ⚠️ Remplace par ton utilisateur MySQL
    password: 'root', // ⚠️ Remplace par ton mot de passe MySQL
    database: 'incidents_db', // La base que tu as créée dans Workbench
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // Crée les tables automatiquement (pratique en dev)
  }),

  // 2. Configuration de GraphQL en mode Subgraph (Federation)
  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    autoSchemaFile: { federation: 2 }, // Génère le schéma automatiquement
  }),

  IncidentsModule
],

})
export class AppModule {}
