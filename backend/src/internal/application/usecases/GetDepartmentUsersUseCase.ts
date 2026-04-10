import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import type { TenantRepository } from '../ports/TenantRepository.js';
import type { UserProvider } from '../ports/UserProvider.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetDepartmentUsersCommand {
  tenantId: TenantRecord['id'];
  departmentExternalId: string;
  active?: boolean;
}

export interface GetDepartmentUsersResultUser {
  id: string;
  displayName: string;
  active: boolean;
  departmentExternalIds: string[];
}

export interface GetDepartmentUsersResult {
  users: GetDepartmentUsersResultUser[];
}

export class GetDepartmentUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly userProvider: UserProvider,
  ) {}

  async execute(
    command: GetDepartmentUsersCommand,
  ): Promise<GetDepartmentUsersResult> {
    const tenant = await this.tenantRepository.loadByIdOrThrow(
      command.tenantId,
    );

    const externalUsers =
      await this.userProvider.fetchAllByDepartmentExternalId(
        command.departmentExternalId,
        tenant.credentials,
      );

    if (externalUsers.length === 0) {
      return {
        users: [],
      };
    }

    const users =
      await this.userRepository.findAllByTenantAndExternalIds(
        command.tenantId,
        externalUsers.map((externalUser) => externalUser.id),
      );

    const usersByExternalId = new Map(
      users.map((user) => [user.externalId, user]),
    );

    return {
      users: externalUsers
        .flatMap((externalUser) => {
          const user = usersByExternalId.get(externalUser.id);

          if (!user) {
            return [];
          }

          return [
            {
              id: user.id,
              displayName: user.displayName,
              active: user.active,
              departmentExternalIds: externalUser.departmentIds,
            },
          ];
        })
        .filter((user) => {
          if (typeof command.active === 'undefined') {
            return true;
          }

          return user.active === command.active;
        }),
    };
  }
}
