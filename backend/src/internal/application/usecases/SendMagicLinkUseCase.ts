import type { AuthTokenRepository } from '../ports/AuthTokenRepository.js';
import type { MagicLinkTokenService } from '../ports/MagicLinkTokenService.js';
import { AuthToken } from '../../domain/user/AuthToken.js';
import { Duration } from '../../domain/time/Duration.js';

export interface SendMagicLinkCommand {
  email: string;
  magicLinkTtlSeconds: number;
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
    private readonly magicLinkTokenService: MagicLinkTokenService,
  ) {}

  async execute(
    command: SendMagicLinkCommand,
  ): Promise<SendMagicLinkResult> {
    const magicLinkToken = this.magicLinkTokenService.create();

    const expiresAt = Duration.seconds(
      command.magicLinkTtlSeconds,
    ).addTo(new Date());

    const authToken = AuthToken.create({
      email: command.email,
      tokenHash: magicLinkToken.tokenHash,
      requestedIp: command.requestedIp,
      requestedUserAgent: command.requestedUserAgent,
      expiresAt,
    });

    await this.authTokenRepository.save(authToken);
    // TODO: Send the magic link email here using the token in the
    // `/api/auth/magic/verify?token=...` URL once a mailer is added.

    console.log(magicLinkToken);

    return {
      data: {
        expiresAt,
        token: magicLinkToken.token,
      },
    };
  }
}
