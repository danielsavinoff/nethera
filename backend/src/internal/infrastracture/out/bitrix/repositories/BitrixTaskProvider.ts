import { Injectable } from '@nestjs/common';
import type { ExternalTask } from '../../../../application/models/ExternalTask.js';
import type {
  FetchExternalTaskQuery,
  FetchExternalTasksQuery,
  TaskProvider,
} from '../../../../application/ports/TaskProvider.js';
import { TaskStatus } from '../../../../domain/task/TaskStatus.js';
import type { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { BitrixClient } from '../clients/BitrixClient.js';

export enum BitrixTaskStatus {
  WaitsExecution = 2,
  InProgress = 3,
  AwaitingControl = 4,
  Completed = 5,
  Deferred = 6,
}

@Injectable()
export class BitrixTaskProvider implements TaskProvider {
  constructor(private readonly bitrixClient: BitrixClient) {}

  async fetch(
    credentials: TenantCredentials,
    query: FetchExternalTaskQuery,
  ): Promise<ExternalTask | null> {
    const bitrixTask = await this.bitrixClient.getTask(
      query.filters.externalId,
      credentials,
    );

    if (!bitrixTask?.id) {
      return null;
    }

    return {
      externalId: String(bitrixTask.id),
      title: String(bitrixTask.title),
      externalGroupId:
        bitrixTask.groupId == null
          ? undefined
          : String(bitrixTask.groupId),
      status: this.mapStatus(bitrixTask.status),
    };
  }

  async fetchMany(
    credentials: TenantCredentials,
    query: FetchExternalTasksQuery,
  ): Promise<ExternalTask[]> {
    const externalIds = query.filters.externalIds ?? [];

    if (externalIds.length === 0) {
      return [];
    }

    const skip = query.page?.skip ?? 0;
    const limit = query.page?.limit;

    const pagedExternalIds = externalIds.slice(
      skip,
      limit == null ? undefined : skip + limit,
    );

    const tasks: ExternalTask[] = [];

    for (
      let chunkStart = 0;
      chunkStart < pagedExternalIds.length;
      chunkStart += 50
    ) {
      const chunkExternalIds = pagedExternalIds.slice(
        chunkStart,
        chunkStart + 50,
      );

      const bitrixTasks = await this.bitrixClient.getTasks(
        chunkExternalIds,
        credentials,
        {
          page: {
            limit: chunkExternalIds.length,
            skip: 0,
          },
        },
      );

      for (const bitrixTask of bitrixTasks) {
        if (!bitrixTask.id) {
          continue;
        }

        const task = {
          externalId: String(bitrixTask.id),
          title: String(bitrixTask.title),
          externalGroupId:
            bitrixTask.groupId == null
              ? undefined
              : String(bitrixTask.groupId),
          status: this.mapStatus(bitrixTask.status),
        };

        tasks.push(task);
      }
    }

    return tasks;
  }

  private mapStatus(
    rawStatus?: number | string | null,
  ): TaskStatus {
    const status =
      typeof rawStatus === 'string'
        ? Number(rawStatus)
        : rawStatus;

    switch (status) {
      case 5:
        return TaskStatus.Completed;
      default:
        return TaskStatus.InProgress;
    }
  }
}
