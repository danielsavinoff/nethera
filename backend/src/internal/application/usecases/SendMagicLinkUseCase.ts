import type { AuthTokenRepository } from '../ports/AuthTokenRepository.js';
import type { MagicLinkTokenService } from '../ports/MagicLinkTokenService.js';
import {
  NotificationChannel,
  NotificationType,
} from '../models/Notification.js';
import type { NotificationService } from '../ports/NotificationService.js';
import { AuthToken } from '../../domain/user/AuthToken.js';
import { Duration } from '../../domain/time/Duration.js';
import type { NotificationComposerSelector } from '../ports/NotificationComposerSelector.js';

export interface SendMagicLinkCommand {
  email: string;
  magicLinkTtlSeconds: number;
  magicLinkVerifyUrlBase: string;
  requestedIp?: string;
  requestedUserAgent?: string;
}

export interface SendMagicLinkResult {
  data: {
    expiresAt: Date;
    token: string;
  };
}

export class SendMagicLinkUseCase {
  constructor(
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly notificationComposerSelector: NotificationComposerSelector,
    private readonly notificationService: NotificationService,
    private readonly magicLinkTokenService: MagicLinkTokenService,
  ) {}

  async execute(
    command: SendMagicLinkCommand,
  ): Promise<SendMagicLinkResult> {
    const tokenDetails = this.magicLinkTokenService.create();

    const expiresAt = Duration.seconds(
      command.magicLinkTtlSeconds,
    ).addTo(new Date());

    const verificationUrl = `${command.magicLinkVerifyUrlBase}?token=${encodeURIComponent(
      tokenDetails.token,
    )}`;

    const authToken = AuthToken.create({
      email: command.email,
      tokenHash: tokenDetails.tokenHash,
      requestedIp: command.requestedIp,
      requestedUserAgent: command.requestedUserAgent,
      expiresAt,
    });

    await this.authTokenRepository.save(authToken);

    const notificationComposer =
      this.notificationComposerSelector.select(
        NotificationType.Auth,
      );

    const notification =
      notificationComposer.compose<NotificationChannel.Email>({
        channel: NotificationChannel.Email,
        recipient: {
          email: command.email,
        },
        subject: {
          link: verificationUrl,
        },
      });

    await this.notificationService.send(notification);

    return {
      data: {
        expiresAt: expiresAt,
        token: tokenDetails.token,
      },
    };
  }
}
