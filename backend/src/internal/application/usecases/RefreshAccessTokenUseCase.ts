import { SessionNotFoundException } from '../exceptions/SessionNotFoundException.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { SessionRepository } from '../ports/SessionRepository.js';
import type { TenantRepository } from '../ports/TenantRepository.js';
import type { TokenIssuer } from '../ports/TokenIssuer.js';
import type { TokenVerifier } from '../ports/TokenVerifier.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface RefreshAccessTokenCommand {
  refreshToken: string;
}

export class RefreshAccessTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly tokenIssuer: TokenIssuer,
    private readonly tokenVerifier: TokenVerifier,
  ) {}

  async execute(command: RefreshAccessTokenCommand) {
    const authClaim =
      await this.tokenVerifier.verifyRefreshToken(
        command.refreshToken,
      );

    const tenant = await this.tenantRepository.loadByIdOrThrow(
      authClaim.tid,
    );

    const user = await this.userRepository.findByIdWithRoles(
      authClaim.sub,
    );

    if (!user) {
      throw new UserNotFoundException();
    }

    const session = await this.sessionRepository.findById(
      authClaim.sid,
    );

    if (!session) {
      throw new SessionNotFoundException();
    }

    const token = await this.tokenIssuer.issue({
      claims: {
        sub: user.id,
        sid: session.id,
        tid: tenant.id,
        roles: user.roles?.map((role) => role.name) ?? [],
      },
    });

    return token;
  }
}
