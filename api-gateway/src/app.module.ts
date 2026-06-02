import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    // Permet la requête HTTP au au la Gateway
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: ({ req }) => ({ req }),
      },
      gateway: {
        // on donner les adresser des services
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            // Si Docker donne une URL, on l'utilise. Sinon (Plan B), on utilise localhost !
            { name: 'auth', url: process.env.AUTH_URL || 'http://localhost:3000/graphql' },
            { name: 'vehicles', url: process.env.VEHICLES_URL || 'http://localhost:3001/graphql' },
            { name: 'traffic', url: process.env.TRAFFIC_URL || 'http://localhost:3002/graphql' },
            { name: 'incidents', url: process.env.INCIDENTS_URL || 'http://localhost:3003/graphql' },
            { name: 'notifications', url: process.env.NOTIFICATIONS_URL || 'http://localhost:3004/graphql' },
          ],
        } ),

        // faire la transfere de Token JWT
        buildService({ name, url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              // Si on a un token on  l'envoie au service
              if (context.req && context.req.headers.authorization) {
                request.http.headers.set(
                  'authorization',
                  context.req.headers.authorization,
                );
              }
            },
          });
        },
      },
    }),
  ],
})
export class AppModule {}
