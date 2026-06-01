import { Module } from '@nestjs/common';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { IncidentsModule } from './incidents/incidents.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'incidents_db', // La base que tu as créée dans Workbench
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Crée les tables automatiquement (pratique en dev)
    }),

    // 2. Configuration de GraphQL en mode Subgraph (Federation)
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 }, // Génère le schéma automatiquement
    }),

    IncidentsModule,
  ],
})
export class AppModule {}
