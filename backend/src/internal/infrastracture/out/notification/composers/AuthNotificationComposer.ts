import { Injectable } from '@nestjs/common';

import { NotificationChannelNotSupportedException } from '../../../../application/exceptions/NotificationChannelNotSupportedException.js';
import { TemplateSubjectRequiredException } from '../../../../application/exceptions/TemplateSubjectRequiredException.js';
import type { NotificationIntent } from '../../../../application/models/NotificationIntent.js';
import {
  NotificationChannel,
  NotificationType,
} from '../../../../application/models/Notification.js';
import type { Notification } from '../../../../application/models/Notification.js';
import type { NotificationComposer } from '../../../../application/ports/NotificationComposer.js';

@Injectable()
export class AuthNotificationComposer implements NotificationComposer {
  compose<C extends NotificationChannel>(
    intent: NotificationIntent<NotificationType.Auth, C>,
  ): Notification {
    if (intent.channel !== NotificationChannel.Email) {
      throw new NotificationChannelNotSupportedException();
    }

    if (!intent.subject) {
      throw new TemplateSubjectRequiredException();
    }

    return {
      recipient: intent.recipient,
      channel: intent.channel,
      subject: 'Your magic sign-in link',
      content: {
        markup: [
          '<p>Use this link to sign in:</p>',
          `<p><a href="${intent.subject.link}">${intent.subject.link}</a></p>`,
        ].join(''),
      },
    };
  }
}
