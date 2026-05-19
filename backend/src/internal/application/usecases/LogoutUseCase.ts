import type { RefreshTokenService } from '../ports/RefreshTokenService.js';
import type { SessionRepository } from '../ports/SessionRepository.js';

export interface LogoutCommand {
  refreshToken: string;
}

export type LogoutResult = void;

export class LogoutUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(command: LogoutCommand): Promise<LogoutResult> {
    const authClaim = await this.refreshTokenService.verify(
      command.refreshToken,
    );

    await this.sessionRepository.delete({
      filters: {
        id: authClaim.sid,
      },
    });
  }
}
