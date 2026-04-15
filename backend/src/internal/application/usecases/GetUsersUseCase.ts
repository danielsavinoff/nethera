import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import type { TenantRepository } from '../ports/TenantRepository.js';
import type { UserProvider } from '../ports/UserProvider.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetUsersCommand {
  tenantId: TenantRecord['id'];
  active?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResultUser {
  id: string;
  displayName: string;
  active: boolean;
  departmentExternalIds: string[];
}

export interface GetUsersResult {
  total: number;
  page: number;
  limit: number;
  users: GetUsersResultUser[];
}

export class GetUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly userProvider: UserProvider,
  ) {}

  async execute(
    command: GetUsersCommand,
  ): Promise<GetUsersResult> {
    const page = command.page ?? 1;
    const limit = command.limit ?? 100;

    const tenant = await this.tenantRepository.loadByIdOrThrow(
      command.tenantId,
    );

    const usersPage =
      await this.userRepository.loadPageByTenantId(
        command.tenantId,
        {
          active: command.active,
          q: command.q,
          page,
          limit,
        },
      );

    const externalUsers = await this.userProvider.fetchAll(
      tenant.credentials,
      {
        filters: {
          externalIds: usersPage.items.map(
            (user) => user.externalId,
          ),
        },
      },
    );

    const externalUsersById = new Map(
      externalUsers.map((externalUser) => [
        externalUser.externalId,
        externalUser,
      ]),
    );

    return {
      total: usersPage.total,
      page,
      limit,
      users: usersPage.items.map((user) => ({
        id: user.id,
        displayName: user.displayName,
        active: user.active,
        departmentExternalIds:
          externalUsersById.get(user.externalId)
            ?.externalDepartmentIds ?? [],
      })),
    };
  }
}
