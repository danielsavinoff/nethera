import { Role } from '../../domain/authorization/Role.js';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
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
    const initiator =
      await this.userRepository.findByIdWithRoles(
        command.initiatorUserId,
      );

    if (!initiator) {
      throw new UserNotFoundException();
    }

    const targetUser =
      await this.userRepository.findByIdWithRoles(
        command.userId,
      );

    if (
      !targetUser ||
      targetUser.tenantId !== initiator.tenantId
    ) {
      throw new UserNotFoundException();
    }

    this.rolePolicy.assertCanView(initiator, targetUser.id);

    return {
      roles: targetUser.roles ?? [],
    };
  }
}
