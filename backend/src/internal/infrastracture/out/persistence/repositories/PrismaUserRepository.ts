import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { Page } from '../../../../application/models/Page.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  LoadUserQuery,
  LoadUsersPageQuery,
  UserRepository,
} from '../../../../application/ports/UserRepository.js';
import { Role } from '../../../../domain/authorization/Role.js';
import { RolePermission } from '../../../../domain/authorization/RolePermission.js';
import { User } from '../../../../domain/user/User.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadUserQuery,
    transactionContext?: TransactionContext,
  ): Promise<User | null> {
    const client = this.getClient(transactionContext);

    if (query.with?.roles) {
      const row = await client.user.findUnique({
        where:
          'id' in query.filters
            ? {
                id: query.filters.id,
              }
            : {
                email: query.filters.email,
              },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!row) {
        return null;
      }

      return User.hydrate({
        id: row.id,
        email: row.email,
        active: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        deletedAt: row.deleted_at ?? undefined,
        language: row.language ?? undefined,
      }).withRoles(
        row.userRoles.map((userRole) =>
          Role.hydrate({
            id: userRole.role.id,
            name: userRole.role.name,
            createdAt: userRole.role.created_at,
            updatedAt: userRole.role.updated_at,
          }).withPermissions(
            userRole.role.permissions.map((permission) =>
              RolePermission.hydrate({
                roleName: userRole.role.name,
                permissionName: permission.permission.name,
                createdAt: permission.created_at,
              }),
            ),
          ),
        ),
      );
    }

    const row = await client.user.findUnique({
      where:
        'id' in query.filters
          ? {
              id: query.filters.id,
            }
          : {
              email: query.filters.email,
            },
    });

    if (!row) {
      return null;
    }

    return User.hydrate({
      id: row.id,
      email: row.email,
      active: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at ?? undefined,
      language: row.language ?? undefined,
    });
  }

  async loadOrThrow(
    query: LoadUserQuery,
    transactionContext?: TransactionContext,
  ): Promise<User> {
    const user = await this.load(query, transactionContext);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async loadPage(
    query: LoadUsersPageQuery,
  ): Promise<Page<User>> {
    const where: Prisma.UserWhereInput = {
      ...(typeof query.filters?.active === 'boolean'
        ? { is_active: query.filters.active }
        : {}),
      ...(query.filters?.q
        ? {
            email: {
              contains: query.filters.q,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const skip = (query.page.number - 1) * query.page.limit;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: [{ email: 'asc' }, { id: 'asc' }],
        skip,
        take: query.page.limit,
      }),
    ]);

    return {
      total,
      items: rows.map((row) =>
        User.hydrate({
          id: row.id,
          email: row.email,
          active: row.is_active,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          deletedAt: row.deleted_at ?? undefined,
          language: row.language ?? undefined,
        }),
      ),
    };
  }

  async save(
    user: User,
    transactionContext?: TransactionContext,
  ): Promise<User> {
    const client = this.getClient(transactionContext);

    const record = user.toRecord();

    const row = await client.user.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        email: record.email,
        is_active: record.active,
        language: record.language,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        deleted_at: record.deletedAt,
        ...(user.isEnrichedWithRoles()
          ? {
              userRoles: {
                createMany: {
                  data:
                    user.roles?.map((role) => ({
                      role_id: role.id,
                    })) ?? [],
                },
              },
            }
          : {}),
      },
      update: {
        email: record.email,
        is_active: record.active,
        language: record.language,
        updated_at: record.updatedAt,
        deleted_at: record.deletedAt,
        ...(user.isEnrichedWithRoles()
          ? {
              userRoles: {
                deleteMany: {},
                createMany: {
                  data:
                    user.roles?.map((role) => ({
                      role_id: role.id,
                    })) ?? [],
                },
              },
            }
          : {}),
      },
    });

    return User.hydrate({
      id: row.id,
      email: row.email,
      active: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at ?? undefined,
      language: row.language ?? undefined,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
