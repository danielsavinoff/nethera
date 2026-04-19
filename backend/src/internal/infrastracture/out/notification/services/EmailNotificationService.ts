import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { NotificationChannel } from '../../../../application/models/Notification.js';
import type { Notification } from '../../../../application/models/Notification.js';
import type { NotificationService } from '../../../../application/ports/NotificationService.js';

@Injectable()
export class EmailNotificationService
  implements NotificationService
{
  constructor(private readonly mailerService: MailerService) {}

  async send(notification: Notification): Promise<void> {
    if (notification.channel !== NotificationChannel.Email) {
      return;
    }

    await this.mailerService.sendMail({
      to: notification.recipient.email,
      subject: notification.subject,
      text:
        'text' in notification.content
          ? notification.content.text
          : undefined,
      html:
        'markup' in notification.content
          ? notification.content.markup
          : undefined,
    });
  }
}
