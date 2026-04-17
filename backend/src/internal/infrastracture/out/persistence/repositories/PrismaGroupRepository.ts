import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ExternalGroupNotFoundException } from '../../../../application/exceptions/ExternalGroupNotFoundException.js';
import type { Page } from '../../../../application/models/Page.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import {
  GroupRepository,
  LoadGroupQuery,
  LoadGroupsQuery,
} from '../../../../application/ports/GroupRepository.js';
import { Group } from '../../../../domain/group/Group.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaGroupRepository implements GroupRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadMany(
    query: LoadGroupsQuery,
  ): Promise<Page<Group>> {
    const where: Prisma.GroupWhereInput = {
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
      this.prisma.group.count({
        where,
      }),
      this.prisma.group.findMany({
        where,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip,
        ...(typeof limit === 'number' ? { take: limit } : {}),
      }),
    ]);

    return {
      total,
      items: rows.map((row) =>
        Group.hydrate({
          id: row.id,
          name: row.name,
          externalId: row.external_id,
          tenantId: row.tenant_id,
          active: row.active,
          isDeleted: row.is_deleted,
        }),
      ),
    };
  }

  async load(
    query: LoadGroupQuery,
    transactionContext?: TransactionContext,
  ): Promise<Group | null> {
    const client = this.getClient(transactionContext);

    const filters = query.filters;

    const row = await client.group.findUnique({
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

    return Group.hydrate({
      id: row.id,
      name: row.name,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      active: row.active,
      isDeleted: row.is_deleted,
    });
  }

  async loadOrThrow(
    query: LoadGroupQuery,
    transactionContext?: TransactionContext,
  ): Promise<Group> {
    const client = this.getClient(transactionContext);

    const filters = query.filters;

    const row = await client.group.findUnique({
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
      throw new ExternalGroupNotFoundException();
    }

    return Group.hydrate({
      id: row.id,
      name: row.name,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      active: row.active,
      isDeleted: row.is_deleted,
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
        is_deleted: record.isDeleted,
      },
      update: {
        name: record.name,
        active: record.active,
        is_deleted: record.isDeleted,
      },
    });

    return Group.hydrate({
      id: row.id,
      name: row.name,
      externalId: row.external_id,
      tenantId: row.tenant_id,
      active: row.active,
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
