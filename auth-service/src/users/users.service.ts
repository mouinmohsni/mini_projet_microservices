import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UnauthorizedException } from '@nestjs/common'; // <-- Ajout
import { JwtService } from '@nestjs/jwt'; // <-- Ajout
import { LoginInput } from './dto/login.input'; // <-- Ajout
import { LoginResponse } from './dto/login-response.type'; // <-- Ajout


@Injectable()
export class UsersService {
    constructor(
        // On injecte le Repository fourni par TypeORM pour interagir avec la table User
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async create(createUserInput: CreateUserInput): Promise<User> {
        // 1. Vérifier si l'email existe déjà
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserInput.email }
        });

        if (existingUser) {
            throw new ConflictException('Un utilisateur avec cet email existe déjà');
        }

        // 2. Hacher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserInput.password, saltRounds);

        // 3. Créer l'instance de l'utilisateur avec le mot de passe haché
        const newUser = this.usersRepository.create({
            ...createUserInput,
            password: hashedPassword,
        });

        // 4. Sauvegarder en base de données et retourner le résultat
        return this.usersRepository.save(newUser);
    }

    async login(loginInput: LoginInput): Promise<LoginResponse> {
        // 1. Chercher l'utilisateur par son email
        const user = await this.usersRepository.findOne({
            where: { email: loginInput.email }
        });

        // Si l'utilisateur n'existe pas, on renvoie une erreur générique (pour ne pas donner d'indices aux hackers)
        if (!user) {
            throw new UnauthorizedException('Identifiants invalides');
        }

        // 2. Comparer le mot de passe envoyé avec le mot de passe haché en base
        const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Identifiants invalides');
        }

        // 3. Si tout est bon, on prépare le contenu du Token (le payload)
        const payload = {
            sub: user.id,
            email: user.email,
            nom : user.nom,
            prenom : user.prenom,
            role: user.role
        };

        // 4. On génère le token et on le renvoie avec les infos de l'utilisateur
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    async findOne(id: number):Promise<User | null>{
        return this.usersRepository.findOne({ where: { id } })
    }

}
