import type { IssuedAccessToken } from '../models/IssuedAccessToken.js';
import type { IssuedRefreshToken } from '../models/IssuedRefreshToken.js';
import { MagicLinkAlreadyUsedException } from '../exceptions/MagicLinkAlreadyUsedException.js';
import { MagicLinkExpiredException } from '../exceptions/MagicLinkExpiredException.js';
import { MagicLinkInvalidException } from '../exceptions/MagicLinkInvalidException.js';
import type { AuthTokenRepository } from '../ports/AuthTokenRepository.js';
import type { AccessTokenService } from '../ports/AccessTokenService.js';
import type { MagicLinkTokenService } from '../ports/MagicLinkTokenService.js';
import type { RefreshTokenService } from '../ports/RefreshTokenService.js';
import type { SessionRepository } from '../ports/SessionRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';
import { User } from '../../domain/user/User.js';
import { Session } from '../../domain/user/Session.js';

export interface LoginWithMagicLinkCommand {
  token: string;
}

export interface LoginWithMagicLinkResult {
  data: {
    tokens: IssuedAccessToken & IssuedRefreshToken;
  };
}

export class LoginWithMagicLinkUseCase {
  constructor(
    private readonly authTokenRepository: AuthTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly accessTokenService: AccessTokenService,
    private readonly magicLinkTokenService: MagicLinkTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(
    command: LoginWithMagicLinkCommand,
  ): Promise<LoginWithMagicLinkResult> {
    const tokenHash = this.magicLinkTokenService.hash(
      command.token,
    );

    const authToken = await this.authTokenRepository.load({
      filters: {
        tokenHash,
      },
    });

    if (!authToken) {
      throw new MagicLinkInvalidException();
    }

    if (authToken.isUsed()) {
      throw new MagicLinkAlreadyUsedException();
    }

    if (authToken.isExpired()) {
      throw new MagicLinkExpiredException();
    }

    let user = await this.userRepository.load({
      filters: {
        email: authToken.email,
      },
      with: {
        roles: true,
      },
    });

    if (!user) {
      user = await this.userRepository.save(
        User.create({
          email: authToken.email,
        }),
      );
    }

    const sessionId = crypto.randomUUID();

    const claims = {
      sub: user.id,
      sid: sessionId,
      roles: user.roles?.map((role) => role.name) ?? [],
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.accessTokenService.issue(claims),
      this.refreshTokenService.issue(claims),
    ]);

    const tokens = {
      ...accessToken,
      ...refreshToken,
    };

    const session = Session.create({
      id: sessionId,
      refreshToken: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + tokens.refreshTokenExpiresIn,
      ),
    });

    await this.sessionRepository.save(session);
    await this.authTokenRepository.save(authToken.markAsUsed());

    return {
      data: {
        tokens,
      },
    };
  }
}
