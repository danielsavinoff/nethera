import type { IssuedAccessToken } from '../models/IssuedAccessToken.js';
import type { AccessTokenService } from '../ports/AccessTokenService.js';
import type { RefreshTokenService } from '../ports/RefreshTokenService.js';
import type { SessionRepository } from '../ports/SessionRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface RefreshAccessTokenCommand {
  refreshToken: string;
}

export interface RefreshAccessTokenResult
  extends IssuedAccessToken {}

export class RefreshAccessTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(
    command: RefreshAccessTokenCommand,
  ): Promise<RefreshAccessTokenResult> {
    const authClaim =
      await this.refreshTokenService.verify(
        command.refreshToken,
      );

    const user = await this.userRepository.loadOrThrow({
      filters: {
        id: authClaim.sub,
      },
      with: {
        roles: true,
      },
    });

    const session = await this.sessionRepository.loadByIdOrThrow(
      authClaim.sid,
    );

    const token = await this.accessTokenService.issue({
      sub: user.id,
      sid: session.id,
      roles: user.roles?.map((role) => role.name) ?? [],
    });

    return token;
  }
}
