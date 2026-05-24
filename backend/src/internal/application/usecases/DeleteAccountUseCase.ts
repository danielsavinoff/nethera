import { Permission } from '../../domain/authorization/Permission.js';
import { User } from '../../domain/user/User.js';
import { UserPolicy } from '../../domain/user/UserPolicy.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface DeleteAccountCommand {
  initiatorUserId: string;
  targetUserId: string;
}

export interface DeleteAccountResult {
  data: {
    user: User;
  };
}

export class DeleteAccountUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userPolicy: UserPolicy,
  ) {}

  async execute(
    command: DeleteAccountCommand,
  ): Promise<DeleteAccountResult> {
    const initiator = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
      with: {
        roles: true,
      },
    });

    const target = await this.userRepository.loadOrThrow({
      filters: {
        id: command.targetUserId,
      },
    });

    const initiatorPermissions = [
      ...new Set(
        (initiator.roles ?? []).flatMap((role) =>
          role
            .getAllPermissions()
            .map((permission) => permission.name),
        ),
      ),
    ] as Permission[];

    this.userPolicy.assertCanDelete(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: target.id,
      },
    );

    const deletedUser = target.delete();

    const savedUser =
      await this.userRepository.save(deletedUser);

    return {
      data: {
        user: savedUser,
      },
    };
  }
}
