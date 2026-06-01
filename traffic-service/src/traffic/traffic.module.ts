import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficService } from './traffic.service';
import { TrafficResolver } from './traffic.resolver';
import { TrafficZone } from './entities/traffic-zone.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy'; // <-- L'import

@Module({
  imports: [
    TypeOrmModule.forFeature([TrafficZone]),
    JwtModule.register({ secret: 'MON_SECRET_TRES_SECURISE' }), // <-- Le module JWT
  ],
  providers: [TrafficResolver, TrafficService, JwtStrategy], // <-- Ajout ici !
  exports: [TrafficService],
})
export class TrafficModule {}

