import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import type { Tenant } from '../../domain/tenant/Tenant.js';
import type { OauthProvider } from '../ports/OauthProvider.js';
import type { SessionRepository } from '../ports/SessionRepository.js';
import type { TokenIssuer } from '../ports/TokenIssuer.js';
import type { UserRepository } from '../ports/UserRepository.js';
import type { AccessAndRefreshTokens } from '../models/IssuedTokenSet.js';
import { Session } from '../../domain/user/Session.js';

export interface LoginWithOauthProviderCommand {
  tenantCredentials: TenantCredentials;
  tenant: Tenant;
  language?: string;
}

export interface LoginWithOauthProviderResult {
  tokens: AccessAndRefreshTokens;
}

export class LoginWithOauthProviderUseCase {
  constructor(
    private readonly oauthProvider: OauthProvider,
    private readonly userRepository: UserRepository,
    private readonly tokenIssuer: TokenIssuer,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(
    command: LoginWithOauthProviderCommand,
  ): Promise<LoginWithOauthProviderResult> {
    const identity = await this.oauthProvider.fetchIdentity(
      command.tenantCredentials,
    );

    let user =
      await this.userRepository.findByTenantAndExternalIdWithRoles(
        command.tenant.id,
        identity.id,
      );

    if (!user) {
      throw new UserNotFoundException();
    }

    if (command.language && user.language !== command.language) {
      const userWithChangedLanguage = (user =
        user.setLanguagePreference(command.language));

      await this.userRepository.save(userWithChangedLanguage);
    }

    const sessionId = crypto.randomUUID();

    const tokens = await this.tokenIssuer.issue({
      claims: {
        sub: user.id,
        tid: command.tenant.id,
        sid: sessionId,
        roles: user.roles?.map((role) => role.name) ?? [],
      },
      includeRefreshToken: true,
    });

    const session = Session.create({
      id: sessionId,
      refreshToken: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + tokens.refreshTokenExpiresIn,
      ),
    });

    await this.sessionRepository.save(session);

    return {
      tokens: tokens,
    };
  }
}
