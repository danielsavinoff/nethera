import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailNotificationService } from './services/EmailNotificationService.js';
import { AuthNotificationComposer } from './composers/AuthNotificationComposer.js';
import { NotificationComposer } from '../../../application/ports/NotificationComposer.js';
import { NotificationType } from '../../../application/models/Notification.js';
import { DefaultNotificationComposerSelector } from './selectors/DefaultNotificationComposerSelector.js';

const NOTIFICATION_COMPOSERS = Symbol('NOTIFICATION_COMPOSERS');

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow('SMTP_HOST'),
          port: config.getOrThrow('SMTP_PORT'),
          secure: true,
          auth: {
            user: config.getOrThrow('SMTP_USER'),
            pass: config.getOrThrow('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.getOrThrow(
            'SMTP_SENDER',
          )}>`,
        },
      }),
    }),
  ],
  providers: [
    AuthNotificationComposer,
    {
      provide: NOTIFICATION_COMPOSERS,
      useFactory: (
        authNotificationComposer: NotificationComposer,
      ) =>
        ({
          [NotificationType.Auth]: authNotificationComposer,
          [NotificationType.SubscriptionExpiresSoon]: undefined,
        }) satisfies Record<
          NotificationType,
          NotificationComposer | undefined
        >,
      inject: [AuthNotificationComposer],
    },
    {
      provide: DefaultNotificationComposerSelector,
      useFactory: (
        strategies: Record<
          NotificationType,
          NotificationComposer
        >,
      ) => {
        return new DefaultNotificationComposerSelector(
          strategies,
        );
      },
      inject: [NOTIFICATION_COMPOSERS],
    },
    EmailNotificationService,
  ],
  exports: [
    AuthNotificationComposer,
    EmailNotificationService,
    DefaultNotificationComposerSelector,
  ],
})
export class NotificationModule {}
