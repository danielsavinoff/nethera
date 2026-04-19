import { Role } from '../../domain/authorization/Role.js';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetUserRolesCommand {
  initiatorUserId: string;
  userId: string;
}

export interface GetUserRolesResult {
  roles: Role[];
}

export class GetUserRolesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolePolicy: RolePolicy,
  ) {}

  async execute(
    command: GetUserRolesCommand,
  ): Promise<GetUserRolesResult> {
    const initiator = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
      with: {
        roles: true,
      },
    });

    const targetUser = await this.userRepository.loadOrThrow({
      filters: {
        id: command.userId,
      },
      with: {
        roles: true,
      },
    });

    this.rolePolicy.assertCanView(initiator, targetUser.id);

    return {
      roles: targetUser.roles ?? [],
    };
  }
}
