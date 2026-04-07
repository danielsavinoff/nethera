import { Role } from '../../domain/authorization/Role.js';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
import { UserNotFoundException } from '../exceptions/UserNotFoundException.js';
import type { RoleRepository } from '../ports/RoleRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface AddUserRoleCommand {
  initiatorUserId: string;
  userId: string;
  roleId: string;
}

export interface AddUserRoleResult {
  userId: string;
  role: Role;
}

export class AddUserRoleUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly rolePolicy: RolePolicy,
  ) {}

  async execute(
    command: AddUserRoleCommand,
  ): Promise<AddUserRoleResult> {
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

    this.rolePolicy.assertCanAssign(initiator);

    const role = await this.roleRepository.loadOrThrow(
      command.roleId,
    );

    const rolesById = new Map(
      [...(targetUser.roles ?? []), role].map((role) => [
        role.id,
        role,
      ]),
    );

    await this.userRepository.save(
      targetUser.withRoles([...rolesById.values()]),
    );

    return {
      userId: targetUser.id,
      role: role,
    };
  }
}
