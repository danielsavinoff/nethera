import type { TenantRecord } from '../../domain/tenant/TenantRecord.js';
import type { TaskStatus } from '../../domain/task/TaskStatus.js';
import type { TaskRepository } from '../ports/TaskRepository.js';
import type { TenantRepository } from '../ports/TenantRepository.js';

export interface GetTasksCommand {
  tenantId: TenantRecord['id'];
  page?: number;
  limit?: number;
}

export interface GetTasksResult {
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  data: {
    tasks: {
      id: string;
      name: string;
      status: TaskStatus;
    }[];
  };
}

export class GetTasksUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    command: GetTasksCommand,
  ): Promise<GetTasksResult> {
    const page = command.page ?? 1;
    const limit = command.limit ?? 100;

    await this.tenantRepository.loadByIdOrThrow(
      command.tenantId,
    );

    const tasksPage = await this.taskRepository.loadMany({
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
        total: tasksPage.total,
        page: page,
        limit: limit,
      },
      data: {
        tasks: tasksPage.items.map((task) => ({
          id: task.id,
          name: task.name,
          status: task.status,
        })),
      },
    };
  }
}
