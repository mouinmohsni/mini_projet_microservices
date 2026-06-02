import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { IncidentsService } from './incidents.service';
import { IncidentsResolver } from './incidents.resolver';
import { Incident } from './entities/incident.entity';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident]), // pour que type orm cree les repo
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
    }),
  ],
  providers: [IncidentsResolver, IncidentsService, JwtStrategy],
  exports: [IncidentsService],
})
export class IncidentsModule {}
