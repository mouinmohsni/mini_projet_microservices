import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string; // Le fameux JWT

  @Field(() => User)
  user: User; // Les infos de l'utilisateur connecté
}
