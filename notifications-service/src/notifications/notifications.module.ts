import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { Notification } from './entities/notification.entity';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]), // <-- C'est LUI qui crée le Repository !
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [NotificationsResolver, NotificationsService, JwtStrategy],
  exports: [NotificationsService],
})
export class NotificationsModule {}
