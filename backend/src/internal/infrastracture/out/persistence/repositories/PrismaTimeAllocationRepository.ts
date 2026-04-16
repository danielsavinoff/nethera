import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import {
  LoadTimeAllocationQuery,
  TimeAllocationRepository,
} from '../../../../application/ports/TimeAllocationRepository.js';
import { TimeAllocation } from '../../../../domain/time-allocation/TimeAllocation.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaTimeAllocationRepository
  implements TimeAllocationRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadTimeAllocationQuery,
    transactionContext?: TransactionContext,
  ): Promise<TimeAllocation | null> {
    const client = this.getClient(transactionContext);

    const row = await client.timeAllocation.findUnique({
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

    return TimeAllocation.hydrate({
      id: row.id,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      groupId: row.group_id ?? undefined,
      taskId: row.task_id,
      priority: row.priority,
      hours: row.hours,
      isApproved: row.is_approved,
      weekNumber: row.week_number,
      year: row.year,
      assigneeId: row.assignee_id,
      assignerId: row.assigner_id,
      isDeleted: row.is_deleted,
    });
  }

  async save(
    timeAllocation: TimeAllocation,
    transactionContext?: TransactionContext,
  ): Promise<TimeAllocation> {
    const client = this.getClient(transactionContext);

    const record = timeAllocation.toRecord();

    const row = await client.timeAllocation.upsert({
      where: {
        external_id_tenant_id: {
          external_id: record.externalId,
          tenant_id: record.tenantId,
        },
      },
      create: {
        id: record.id,
        external_id: record.externalId,
        tenant_id: record.tenantId,
        group_id: record.groupId,
        task_id: record.taskId,
        priority: record.priority,
        hours: record.hours,
        is_approved: record.isApproved,
        week_number: record.weekNumber,
        year: record.year,
        assignee_id: record.assigneeId,
        assigner_id: record.assignerId,
        is_deleted: record.isDeleted,
      },
      update: {
        group_id: record.groupId,
        task_id: record.taskId,
        priority: record.priority,
        hours: record.hours,
        is_approved: record.isApproved,
        week_number: record.weekNumber,
        year: record.year,
        assignee_id: record.assigneeId,
        assigner_id: record.assignerId,
        is_deleted: record.isDeleted,
      },
    });

    return TimeAllocation.hydrate({
      id: row.id,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      groupId: row.group_id ?? undefined,
      taskId: row.task_id,
      priority: row.priority,
      hours: row.hours,
      isApproved: row.is_approved,
      weekNumber: row.week_number,
      year: row.year,
      assigneeId: row.assignee_id,
      assignerId: row.assigner_id,
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
