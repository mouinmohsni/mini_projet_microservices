import { SetMetadata } from '@nestjs/common';

// cree le decorateur role pour l'utiliser dans les mutation
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
