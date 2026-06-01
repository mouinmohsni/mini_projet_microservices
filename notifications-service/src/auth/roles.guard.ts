import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // On regarde quel rôle est exigé pour cette route
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // Si aucun rôle n'est exigé, on laisse passer
    }

    // On récupère l'utilisateur décodé par le GqlAuthGuard
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    // On vérifie si l'utilisateur a le bon rôle
    return user && requiredRoles.includes(user.role);
  }
}
