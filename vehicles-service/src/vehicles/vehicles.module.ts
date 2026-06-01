import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesResolver } from './vehicles.resolver';
import { VehiclesService } from './vehicles.service';
import { VehiclePosition } from './entities/vehicle-position.entity';
import { Vehicule } from './entities/vehicule.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicule, VehiclePosition]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [VehiclesResolver, VehiclesService, JwtStrategy],
  exports: [VehiclesService],
})
export class VehiclesModule {}
