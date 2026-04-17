import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import type { GroupRepository } from '../ports/GroupRepository.js';
import type { TenantRepository } from '../ports/TenantRepository.js';

export interface GetGroupsCommand {
  tenantId: TenantRecord['id'];
  page?: number;
  limit?: number;
}

export interface GetGroupsResult {
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  data: {
    groups: {
      id: string;
      name: string;
      active: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[];
  };
}

export class GetGroupsUseCase {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    command: GetGroupsCommand,
  ): Promise<GetGroupsResult> {
    const page = command.page ?? 1;
    const limit = command.limit ?? 100;

    await this.tenantRepository.loadByIdOrThrow(
      command.tenantId,
    );

    const groupsPage = await this.groupRepository.loadMany({
      filters: {
        tenantId: command.tenantId,
        isDeleted: false,
      },
      page: {
        limit: limit,
        skip: (page - 1) * limit,
      },
    });

    return {
      pagination: {
        total: groupsPage.total,
        page: page,
        limit: limit,
      },
      data: {
        groups: groupsPage.items.map((group) => ({
          id: group.id,
          name: group.name,
          active: group.active,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
        })),
      },
    };
  }
}
