import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import {
  LoadTaskQuery,
  TaskRepository,
} from '../../../../application/ports/TaskRepository.js';
import { Task } from '../../../../domain/task/Task.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadTaskQuery,
    transactionContext?: TransactionContext,
  ): Promise<Task | null> {
    const client = this.getClient(transactionContext);

    const row = await client.task.findUnique({
      where: {
        external_id_tenant_id: {
          external_id: query.filters.externalId,
          tenant_id: query.filters.tenantId,
        },
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
      },
      update: {
        name: record.name,
        status: record.status,
        is_deleted: record.isDeleted,
      },
    });

    return Task.hydrate({
      id: row.id,
      name: row.name,
      status: row.status,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      isDeleted: row.is_deleted,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
