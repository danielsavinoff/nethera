import { Permission } from '../../domain/authorization/Permission.js';
import { User } from '../../domain/user/User.js';
import {
  UpdateUserField,
  UserPolicy,
} from '../../domain/user/UserPolicy.js';
import { UserRecord } from '../../domain/user/UserRecord.js';
import { UserRepository } from '../ports/UserRepository.js';

export interface UpdateCurrentUserCurrencyResult {
  data: {
    user: User;
  };
}

export interface UpdateCurrentUserCurrencyCommand {
  userId: UserRecord['id'];
  preferredCurrencyCode: string;
}

export class UpdateCurrentUserCurrencyUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userPolicy: UserPolicy,
  ) {}

  async execute(
    command: UpdateCurrentUserCurrencyCommand,
  ): Promise<UpdateCurrentUserCurrencyResult> {
    const user = await this.userRepository.loadOrThrow({
      filters: {
        id: command.userId,
      },
      with: {
        roles: true,
      },
    });

    const permissions = [
      ...new Set(
        (user.roles ?? []).flatMap((role) =>
          role
            .getAllPermissions()
            .map((permission) => permission.name),
        ),
      ),
    ] as Permission[];

    this.userPolicy.assertCanUpdate(
      {
        userId: user.id,
        permissions,
      },
      {
        userId: user.id,
        fields: {
          [UpdateUserField.Currency]: true,
        },
      },
    );

    const savedUser = await this.userRepository.save(
      user.setPreferredCurrencyCode(
        command.preferredCurrencyCode,
      ),
    );

    return {
      data: {
        user: savedUser,
      },
    };
  }
}
