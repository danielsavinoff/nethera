import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ExternalTaskNotFoundException } from '../../../../application/exceptions/ExternalTaskNotFoundException.js';
import type { Page } from '../../../../application/models/Page.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import {
  LoadTaskQuery,
  LoadTasksQuery,
  TaskRepository,
} from '../../../../application/ports/TaskRepository.js';
import { Task } from '../../../../domain/task/Task.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadMany(query: LoadTasksQuery): Promise<Page<Task>> {
    const where: Prisma.TaskWhereInput = {
      tenant_id: query.filters.tenantId,
      ...(typeof query.filters.isDeleted === 'boolean'
        ? {
            is_deleted: query.filters.isDeleted,
          }
        : {}),
    };

    const limit = query.page?.limit;
    const skip = query.page?.skip ?? 0;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.task.count({
        where,
      }),
      this.prisma.task.findMany({
        where,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip,
        ...(typeof limit === 'number' ? { take: limit } : {}),
      }),
    ]);

    return {
      total,
      items: rows.map((row) =>
        Task.hydrate({
          id: row.id,
          name: row.name,
          status: row.status,
          externalId: row.external_id,
          tenantId: row.tenant_id,
          isDeleted: row.is_deleted,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
      ),
    };
  }

  async load(
    query: LoadTaskQuery,
    transactionContext?: TransactionContext,
  ): Promise<Task | null> {
    const client = this.getClient(transactionContext);

    const filters = query.filters;

    const row = await client.task.findUnique({
      where: {
        ...('id' in filters
          ? { id: filters.id }
          : {
              external_id_tenant_id: {
                external_id: filters.externalId,
                tenant_id: filters.tenantId,
              },
            }),
      },
    });

    if (!row) {
      return null;
    }

    return Task.hydrate({
      id: row.id,
      name: row.name,
      status: row.status,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async loadOrThrow(
    query: LoadTaskQuery,
    transactionContext?: TransactionContext,
  ): Promise<Task> {
    const client = this.getClient(transactionContext);

    const filters = query.filters;

    const row = await client.task.findUnique({
      where: {
        ...('id' in filters
          ? { id: filters.id }
          : {
              external_id_tenant_id: {
                external_id: filters.externalId,
                tenant_id: filters.tenantId,
              },
            }),
      },
    });

    if (!row) {
      throw new ExternalTaskNotFoundException();
    }

    return Task.hydrate({
      id: row.id,
      name: row.name,
      status: row.status,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async save(
    task: Task,
    transactionContext?: TransactionContext,
  ): Promise<Task> {
    const client = this.getClient(transactionContext);

    const record = task.toRecord();

    const row = await client.task.upsert({
      where: {
        external_id_tenant_id: {
          external_id: record.externalId,
          tenant_id: record.tenantId,
        },
      },
      create: {
        id: record.id,
        name: record.name,
        status: record.status,
        external_id: record.externalId,
        tenant_id: record.tenantId,
        is_deleted: record.isDeleted,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        name: record.name,
        status: record.status,
        is_deleted: record.isDeleted,
        updated_at: record.updatedAt,
      },
    });

    return Task.hydrate({
      id: row.id,
      name: row.name,
      status: row.status,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      isDeleted: row.is_deleted,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
