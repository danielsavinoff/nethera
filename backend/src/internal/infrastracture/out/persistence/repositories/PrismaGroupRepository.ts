import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import {
  GroupRepository,
  LoadGroupQuery,
} from '../../../../application/ports/GroupRepository.js';
import { Group } from '../../../../domain/group/Group.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaGroupRepository implements GroupRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadGroupQuery,
    transactionContext?: TransactionContext,
  ): Promise<Group | null> {
    const client = this.getClient(transactionContext);
    const row = await client.group.findUnique({
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

    return Group.hydrate({
      id: row.id,
      name: row.name,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      active: row.active,
    });
  }

  async save(
    group: Group,
    transactionContext?: TransactionContext,
  ): Promise<Group> {
    const client = this.getClient(transactionContext);
    const record = group.toRecord();
    const row = await client.group.upsert({
      where: {
        external_id_tenant_id: {
          external_id: record.externalId,
          tenant_id: record.tenantId,
        },
      },
      create: {
        id: record.id,
        name: record.name,
        external_id: record.externalId,
        tenant_id: record.tenantId,
        active: record.active,
      },
      update: {
        name: record.name,
        active: record.active,
      },
    });

    return Group.hydrate({
      id: row.id,
      name: row.name,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      active: row.active,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
