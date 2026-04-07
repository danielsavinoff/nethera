import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RoleRepository } from '../../../../application/ports/RoleRepository.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { Role } from '../../../../domain/authorization/Role.js';
import { UserRole } from '../../../../domain/authorization/UserRole.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';
import { RoleNotFoundException } from '../../../../application/exceptions/RoleNotFoundException.js';

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<Role[]> {
    const rows = await this.prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return rows.map((row) =>
      Role.hydrate({
        id: row.id,
        name: row.name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }),
    );
  }

  async loadOrThrow(
    id: Role['id'],
    transactionContext?: TransactionContext,
  ): Promise<Role> {
    const client = this.getClient(transactionContext);

    const row = await client.role.findUnique({
      where: {
        id,
      },
    });

    if (!row) {
      throw new RoleNotFoundException();
    }

    return Role.hydrate({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async loadByName(
    name: UserRole,
    transactionContext?: TransactionContext,
  ): Promise<Role | null> {
    const client = this.getClient(transactionContext);

    const row = await client.role.findUnique({
      where: {
        name,
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

  async loadByNames(
    names: UserRole[],
    transactionContext?: TransactionContext,
  ): Promise<Role[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.role.findMany({
      where: {
        name: {
          in: names,
        },
      },
    });

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

    return names
      .map((name) => rolesByName.get(name))
      .filter((role): role is Role => Boolean(role));
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
