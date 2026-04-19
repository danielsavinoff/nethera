import { Role } from '../../domain/authorization/Role.js';
import { RolePolicy } from '../../domain/authorization/RolePolicy.js';
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
