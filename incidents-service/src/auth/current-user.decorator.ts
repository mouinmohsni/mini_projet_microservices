import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        // On déballe le contexte GraphQL
        const ctx = GqlExecutionContext.create(context);
        // On retourne l'utilisateur qui a été attaché à la requête par la JwtStrategy
        return ctx.getContext().req.user;
    },
);
