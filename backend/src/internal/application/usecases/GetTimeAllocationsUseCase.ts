import { ExternalTimeAllocation } from '../models/ExternalTimeAllocation.js';
import type { ExternalGroup } from '../models/ExternalGroup.js';
import type { GroupProvider } from '../ports/GroupProvider.js';
import type { SmartProcessRepository } from '../ports/SmartProcessRepository.js';
import type { TaskProvider } from '../ports/TaskProvider.js';
import type { TenantRepository } from '../ports/TenantRepository.js';
import type { TimeAllocationSmartProcessProvider } from '../ports/TimeAllocationSmartProcessProvider.js';
import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import type { ExternalTask } from '../models/ExternalTask.js';
import type { UserRecord } from '../../domain/user/UserRecord.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetTimeAllocationsCommand {
  tenantId: TenantRecord['id'];
  userId: UserRecord['id'];
  year: number;
  weekNumber?: number;
  weekNumberFrom?: number;
  weekNumberTo?: number;
  page?: number;
  limit?: number;
}

export interface GetTimeAllocationsResult {
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  data?: {
    items: {
      externalTask: ExternalTask;
      externalGroup: ExternalGroup;
      externalTimeAllocation: ExternalTimeAllocation;
    }[];
  };
}

export class GetTimeAllocationsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly smartProcessRepository: SmartProcessRepository,
    private readonly timeAllocationSmartProcessProvider: TimeAllocationSmartProcessProvider,
    private readonly taskProvider: TaskProvider,
    private readonly groupProvider: GroupProvider,
  ) {}

  async execute(
    command: GetTimeAllocationsCommand,
  ): Promise<GetTimeAllocationsResult> {
    const page = command.page ?? 1;
    const limit = command.limit ?? 100;

    const user = await this.userRepository.findByIdOrThrow(
      command.userId,
    );

    const tenant = await this.tenantRepository.loadByIdOrThrow(
      command.tenantId,
    );

    const smartProcess =
      await this.smartProcessRepository.loadByTenantId(
        command.tenantId,
      );

    if (!smartProcess) {
      return {
        pagination: {
          total: 0,
          page,
          limit,
        },
      };
    }

    const { items: externalTimeAllocations, total: total } =
      await this.timeAllocationSmartProcessProvider.fetchMany(
        tenant.credentials,
        smartProcess.externalId,
        {
          filters: {
            externalUserId: String(user.externalId),
            year: command.year,
            weekNumber: command.weekNumber,
            weekNumberFrom: command.weekNumberFrom,
            weekNumberTo: command.weekNumberTo,
          },
          page: {
            limit,
            skip: (page - 1) * limit,
          },
        },
      );

    const externalTaskIds = [
      ...new Set(
        externalTimeAllocations
          .map((timeAllocation) => timeAllocation.externalTaskId)
          .filter((externalTaskId): externalTaskId is string =>
            Boolean(externalTaskId),
          ),
      ),
    ];

    const externalGroupIds = [
      ...new Set(
        externalTimeAllocations
          .map(
            (timeAllocation) => timeAllocation.externalGroupId,
          )
          .filter((externalGroupId): externalGroupId is string =>
            Boolean(externalGroupId),
          ),
      ),
    ];
    const [externalGroups, externalTasks] = await Promise.all([
      this.groupProvider.fetchMany(tenant.credentials, {
        filters: {
          externalIds: externalGroupIds,
        },
      }),
      this.taskProvider.fetchMany(tenant.credentials, {
        filters: {
          externalIds: externalTaskIds,
        },
      }),
    ]);

    const groupsById = new Map(
      externalGroups.map((group) => [group.externalId, group]),
    );

    const tasksById = new Map(
      externalTasks.map((task) => [task.externalId, task]),
    );

    return {
      pagination: {
        total: total,
        page,
        limit,
      },
      data: {
        items: externalTimeAllocations.map(
          (externalTimeAllocation) => ({
            externalTask: tasksById.get(
              externalTimeAllocation.externalTaskId,
            ) ?? {
              externalId: externalTimeAllocation.externalTaskId,
              title: '',
              externalGroupId:
                externalTimeAllocation.externalGroupId,
            },
            externalGroup: groupsById.get(
              externalTimeAllocation.externalGroupId,
            ) ?? {
              externalId: externalTimeAllocation.externalGroupId,
              name: '',
            },
            externalTimeAllocation: externalTimeAllocation,
          }),
        ),
      },
    };
  }
}
