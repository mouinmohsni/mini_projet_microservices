import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  //  cree une notification
  async create(
    createNotificationInput: CreateNotificationInput,
  ): Promise<Notification> {
    const newNotification = this.notificationRepository.create(
      createNotificationInput,
    );
    return this.notificationRepository.save(newNotification);
  }

  // Consulter les notifications par user id
  async findAllForUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' }, // 💡 Astuce : Les plus récentes en premier !
    });
  }

  // Marquer une notification comme lue
  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }

    //  On vérifie que la notification appartient bien à l'utilisateur connecté
    if (notification.userId !== userId) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier cette notification",
      );
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }
}
