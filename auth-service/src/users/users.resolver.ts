import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveReference,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login-response.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';


@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Mutation(() => User, {
    name: 'register',
    description: 'Inscrire un nouvel utilisateur',
  })
  async register(
    // On récupère les donner
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {

    return this.usersService.create(createUserInput);
  }

  @Mutation(() => LoginResponse, {
    name: 'login',
    description: 'Connecter un utilisateur',
  })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    return this.usersService.login(loginInput);
  }

  @Query(() => User, { name: 'me', description: 'Récupérer mon profil' })
  @UseGuards(GqlAuthGuard) //  Accès refusé sans token valide.
  async me(@CurrentUser() user: any): Promise<User | null> {
    return this.usersService.findOne(user.id);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: number;
  }): Promise<User | null> {
    // L'API Gateway nous envoie une "référence" contenant l'ID.
    // On utilise notre service pour lui renvoyer l'utilisateur complet !
    return this.usersService.findOne(reference.id);
  }
}
