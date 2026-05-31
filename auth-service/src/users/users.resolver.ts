import { Resolver, Mutation, Args ,Query ,ResolveReference } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login-response.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';


// On indique que ce Resolver gère le type "User"
@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    // On crée une Mutation (car on modifie/ajoute de la donnée)
    // On la nomme 'register' pour que ce soit clair pour le client
    @Mutation(() => User, { name: 'register', description: 'Inscrire un nouvel utilisateur' })
    async register(
        // On récupère les arguments envoyés par le client et on les valide avec notre dto
        @Args('createUserInput') createUserInput: CreateUserInput,
    ): Promise<User> {
        // On passe le relais au service
        return this.usersService.create(createUserInput);
    }

    @Mutation(() => LoginResponse, { name: 'login', description: 'Connecter un utilisateur' })
    async login(
        @Args('loginInput') loginInput: LoginInput,
    ): Promise<LoginResponse> {
        return this.usersService.login(loginInput);
    }

    @Query(() => User, { name: 'me', description: 'Récupérer mon profil' })
    @UseGuards(GqlAuthGuard) // 🛡️ LE VIDEUR EST ICI ! Accès refusé sans token valide.
    async me(@CurrentUser() user: any): Promise<User | null> {
        // Le Guard a fait le travail, on a l'ID de l'utilisateur dans 'user.id'
        return this.usersService.findOne(user.id);
    }

    @ResolveReference()
    resolveReference(reference: { __typename: string; id: number }): Promise<User | null> {
        // L'API Gateway nous envoie une "référence" contenant l'ID.
        // On utilise notre service pour lui renvoyer l'utilisateur complet !
        return this.usersService.findOne(reference.id);
    }

}
