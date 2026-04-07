import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import { UserRoleAssignmentNotFoundException } from '../exceptions/UserRoleAssignmentNotFoundException.js';
import type { RoleRepository } from '../ports/RoleRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface DeleteUserRoleCommand {
  initiatorUserId: string;
  userId: string;
  roleId: string;
}

export interface DeleteUserRoleResult {
  roleId: string;
}

export class DeleteUserRoleUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly rolePolicy: RolePolicy,
  ) {}

  async execute(
    command: DeleteUserRoleCommand,
  ): Promise<DeleteUserRoleResult> {
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

    this.rolePolicy.assertCanRemove(initiator);

    const role = await this.roleRepository.loadOrThrow(
      command.roleId,
    );

    const nextRoles = (targetUser.roles ?? []).filter(
      (userRole) => userRole.id !== role.id,
    );

    if (nextRoles.length === (targetUser.roles ?? []).length) {
      throw new UserRoleAssignmentNotFoundException();
    }

    await this.userRepository.save(
      targetUser.withRoles(nextRoles),
    );

    return {
      roleId: role.id,
    };
  }
}
