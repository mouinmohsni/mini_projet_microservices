import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';


@Module({
  // On importe l'entité User pour que TypeORM génère un "Repository" (un outil pour faire des requêtes SQL facilement)
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'MON_SECRET_TRES_SECURISE', // En production, on mettra ça dans un fichier .env !
    signOptions: { expiresIn: '1h' }, // Le token expirera dans 1 heure
  }),
  ],
  providers: [UsersResolver, UsersService,JwtStrategy],
  exports: [UsersService], // On l'exporte au cas où un autre module en aurait besoin plus tard
})
export class UsersModule {}
