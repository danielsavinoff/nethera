import { NotificationType } from '../../../../application/models/Notification.js';
import { NotificationComposer } from '../../../../application/ports/NotificationComposer.js';
import type { NotificationComposerSelector } from '../../../../application/ports/NotificationComposerSelector.js';
import { Injectable } from '@nestjs/common';
import { ComposerNotSupportedException } from '../../../../application/exceptions/ComposerNotSupportedException.js';

@Injectable()
export class DefaultNotificationComposerSelector implements NotificationComposerSelector {
  constructor(
    private readonly composers: Record<
      NotificationType,
      NotificationComposer
    >,
  ) {}

  select(type: NotificationType): NotificationComposer {
    const composer = this.composers[type];

    if (!composer) {
      throw new ComposerNotSupportedException();
    }

    return composer;
  }
}
