import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  // On importe l'entité User pour que TypeORM génère un "Repository"
  imports: [
    TypeOrmModule.forFeature([User]),
      //configuer le JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersResolver, UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
