import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // Permet de passer la requête HTTP au contexte de la Gateway
        context: ({ req }) => ({ req }),
      },
      gateway: {
        // 1. On liste nos 5 microservices avec leurs ports respectifs
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: 'http://localhost:3000/graphql' },
            { name: 'vehicles', url: 'http://localhost:3001/graphql' },
            { name: 'traffic', url: 'http://localhost:3002/graphql' },
            { name: 'incidents', url: 'http://localhost:3003/graphql' },
            { name: 'notifications', url: 'http://localhost:3004/graphql' },
          ],
        }),
        // 2. On configure le transfert du Token JWT
        buildService({ name, url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              // Si le client a envoyé un token à la Gateway, on le copie et on l'envoie au sous-service
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
