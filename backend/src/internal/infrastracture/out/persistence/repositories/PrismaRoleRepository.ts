import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  RoleRepository,
  type LoadRoleQuery,
  type LoadRolesQuery,
} from '../../../../application/ports/RoleRepository.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { Role } from '../../../../domain/authorization/Role.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';
import { RoleNotFoundException } from '../../../../application/exceptions/RoleNotFoundException.js';

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadRoleQuery,
    transactionContext?: TransactionContext,
  ): Promise<Role | null> {
    const client = this.getClient(transactionContext);

    const row = await client.role.findFirst({
      where:
        'id' in query.filters
          ? {
              id: query.filters.id,
            }
          : {
              name: query.filters.name,
            },
    });

    if (!row) {
      return null;
    }

    return Role.hydrate({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async loadMany(
    query: LoadRolesQuery,
    transactionContext?: TransactionContext,
  ): Promise<Role[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.role.findMany({
      where: query.filters?.names
        ? {
            name: {
              in: query.filters.names,
            },
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    });

    if (!query.filters?.names) {
      return rows.map((row) =>
        Role.hydrate({
          id: row.id,
          name: row.name,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
      );
    }

    const rolesByName = new Map(
      rows.map((row) => [
        row.name,
        Role.hydrate({
          id: row.id,
          name: row.name,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
      ]),
    );

    return query.filters.names
      .map((name) => rolesByName.get(name))
      .filter((role): role is Role => Boolean(role));
  }

  async loadOrThrow(
    query: LoadRoleQuery,
    transactionContext?: TransactionContext,
  ): Promise<Role> {
    const role = await this.load(query, transactionContext);

    if (!role) {
      throw new RoleNotFoundException();
    }

    return role;
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
