import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './dto/login-response.type';

@Injectable()
export class UsersService {
  constructor(
    // On injecte le Repository de TypeORM
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}


  // methode register
  async create(createUserInput: CreateUserInput): Promise<User> {
    // Vérifier si l'email existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserInput.email },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hacher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      saltRounds,
    );

    // Créer le user avec le mot de passe haché
    const newUser = this.usersRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });

    // 4. Sauvegarder en base de données
    return this.usersRepository.save(newUser);
  }

  //methode login
  async login(loginInput: LoginInput): Promise<LoginResponse> {
    // Chercher l'utilisateur par son email
    const user = await this.usersRepository.findOne({
      where: { email: loginInput.email },
    });

    // Si l'utilisateur n'existe pas
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Comparer le mot de passe
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }


    const payload = {
      sub: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
    };

    // 4. On génère le token
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }


  //methode pour chercher un user par id
  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
