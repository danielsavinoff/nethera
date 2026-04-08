import { User } from '../../domain/user/User.js';
import { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import { UserRepository } from '../ports/UserRepository.js';

export interface GetUsersCommand {
  tenantId: TenantRecord['id'];
  active?: boolean;
}

export interface GetUsersResult {
  users: User[];
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    command: GetUsersCommand,
  ): Promise<GetUsersResult> {
    if (command.active === true) {
      const users =
        await this.userRepository.loadAllActiveByTenantId(
          command.tenantId,
        );

      return {
        users,
      };
    }

    if (command.active === false) {
      const users =
        await this.userRepository.loadAllInactiveByTenantId(
          command.tenantId,
        );

      return {
        users,
      };
    }

    const users = await this.userRepository.loadAllByTenantId(
      command.tenantId,
    );

    return {
      users,
    };
  }
}
