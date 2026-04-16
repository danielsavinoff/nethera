import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  LoadUserQuery,
  UserRepository,
} from '../../../../application/ports/UserRepository.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { Page } from '../../../../application/models/Page.js';
import { User } from '../../../../domain/user/User.js';
import { UserRecord } from '../../../../domain/user/UserRecord.js';
import { TenantRecord } from '../../../../domain/tenant/TenantRecord.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';
import { Role } from '../../../../domain/authorization/Role.js';
import { RolePermission } from '../../../../domain/authorization/RolePermission.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadPageByTenantId(
    tenantId: TenantRecord['id'],
    options: {
      active?: boolean;
      q?: string;
      page: number;
      limit: number;
    },
  ): Promise<Page<User>> {
    const where: Prisma.UserWhereInput = {
      tenant_id: tenantId,
      ...(typeof options.active === 'boolean'
        ? { active: options.active }
        : {}),
      ...(options.q
        ? {
            OR: [
              {
                first_name: {
                  contains: options.q,
                  mode: 'insensitive',
                },
              },
              {
                second_name: {
                  contains: options.q,
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  contains: options.q,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const skip = (options.page - 1) * options.limit;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.user.count({
        where,
      }),
      this.prisma.user.findMany({
        where,
        orderBy: [{ first_name: 'asc' }, { id: 'asc' }],
        skip,
        take: options.limit,
      }),
    ]);

    return {
      total,
      items: rows.map((row) =>
        User.hydrate({
          active: row.active,
          createdAt: row.created_at,
          deletedAt: row.deleted_at ?? undefined,
          externalId: row.external_id,
          firstName: row.first_name ?? undefined,
          id: row.id,
          lastName: row.last_name ?? undefined,
          secondName: row.second_name ?? undefined,
          tenantId: row.tenant_id,
          updatedAt: row.updated_at,
          language: row.language ?? undefined,
        }),
      ),
    };
  }

  async loadAllByTenantId(
    tenantId: TenantRecord['id'],
  ): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      where: {
        tenant_id: tenantId,
      },
      orderBy: [{ first_name: 'asc' }, { id: 'asc' }],
    });

    return rows.map((row) =>
      User.hydrate({
        active: row.active,
        createdAt: row.created_at,
        deletedAt: row.deleted_at ?? undefined,
        externalId: row.external_id,
        firstName: row.first_name ?? undefined,
        id: row.id,
        lastName: row.last_name ?? undefined,
        secondName: row.second_name ?? undefined,
        tenantId: row.tenant_id,
        updatedAt: row.updated_at,
        language: row.language ?? undefined,
      }),
    );
  }

  async loadAllActiveByTenantId(
    tenantId: TenantRecord['id'],
  ): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      where: {
        tenant_id: tenantId,
        active: true,
      },
      orderBy: [{ first_name: 'asc' }, { id: 'asc' }],
    });

    return rows.map((row) =>
      User.hydrate({
        active: row.active,
        createdAt: row.created_at,
        deletedAt: row.deleted_at ?? undefined,
        externalId: row.external_id,
        firstName: row.first_name ?? undefined,
        id: row.id,
        lastName: row.last_name ?? undefined,
        secondName: row.second_name ?? undefined,
        tenantId: row.tenant_id,
        updatedAt: row.updated_at,
        language: row.language ?? undefined,
      }),
    );
  }

  async loadAllInactiveByTenantId(
    tenantId: TenantRecord['id'],
  ): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      where: {
        tenant_id: tenantId,
        active: false,
      },
      orderBy: [{ first_name: 'asc' }, { id: 'asc' }],
    });

    return rows.map((row) =>
      User.hydrate({
        active: row.active,
        createdAt: row.created_at,
        deletedAt: row.deleted_at ?? undefined,
        externalId: row.external_id,
        firstName: row.first_name ?? undefined,
        id: row.id,
        lastName: row.last_name ?? undefined,
        secondName: row.second_name ?? undefined,
        tenantId: row.tenant_id,
        updatedAt: row.updated_at,
        language: row.language ?? undefined,
      }),
    );
  }

  async findByTenantAndExternalIdWithRoles(
    tenantId: string,
    externalId: number,
    transactionContext?: TransactionContext,
  ): Promise<User | null> {
    const client = this.getClient(transactionContext);
    const row = await client.user.findUnique({
      where: {
        external_id_tenant_id: {
          external_id: externalId,
          tenant_id: tenantId,
        },
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
      active: row.active,
      createdAt: row.created_at,
      deletedAt: row.deleted_at ?? undefined,
      externalId: row.external_id,
      firstName: row.first_name ?? undefined,
      id: row.id,
      lastName: row.last_name ?? undefined,
      secondName: row.second_name ?? undefined,
      tenantId: row.tenant_id,
      updatedAt: row.updated_at,
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

  async findAllByTenantAndExternalIds(
    tenantId: string,
    externalIds: number[],
  ): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      where: {
        tenant_id: tenantId,
        external_id: {
          in: externalIds,
        },
      },
    });

    if (rows.length === 0) {
      return [];
    }

    return rows.map((row) =>
      User.hydrate({
        active: row.active,
        createdAt: row.created_at,
        deletedAt: row.deleted_at ?? undefined,
        externalId: row.external_id,
        firstName: row.first_name ?? undefined,
        id: row.id,
        lastName: row.last_name ?? undefined,
        secondName: row.second_name ?? undefined,
        tenantId: row.tenant_id,
        updatedAt: row.updated_at,
        language: row.language ?? undefined,
      }),
    );
  }

  async loadOrThrow(
    query: LoadUserQuery,
    transactionContext?: TransactionContext,
  ): Promise<User> {
    const client = this.getClient(transactionContext);

    const filters = query.filters;

    const row = await client.user.findUnique({
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
      throw new UserNotFoundException();
    }

    return User.hydrate({
      active: row.active,
      createdAt: row.created_at,
      deletedAt: row.deleted_at ?? undefined,
      externalId: row.external_id,
      firstName: row.first_name ?? undefined,
      id: row.id,
      lastName: row.last_name ?? undefined,
      secondName: row.second_name ?? undefined,
      tenantId: row.tenant_id,
      updatedAt: row.updated_at,
      language: row.language ?? undefined,
    });
  }

  async findById(id: UserRecord['id']): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!row) {
      return null;
    }

    return User.hydrate({
      active: row.active,
      createdAt: row.created_at,
      deletedAt: row.deleted_at ?? undefined,
      externalId: row.external_id,
      firstName: row.first_name ?? undefined,
      id: row.id,
      lastName: row.last_name ?? undefined,
      secondName: row.second_name ?? undefined,
      tenantId: row.tenant_id,
      updatedAt: row.updated_at,
      language: row.language ?? undefined,
    });
  }

  async findByIdOrThrow(id: UserRecord['id']): Promise<User> {
    const row = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!row) {
      throw new UserNotFoundException();
    }

    return User.hydrate({
      active: row.active,
      createdAt: row.created_at,
      deletedAt: row.deleted_at ?? undefined,
      externalId: row.external_id,
      firstName: row.first_name ?? undefined,
      id: row.id,
      lastName: row.last_name ?? undefined,
      secondName: row.second_name ?? undefined,
      tenantId: row.tenant_id,
      updatedAt: row.updated_at,
      language: row.language ?? undefined,
    });
  }

  async findByIdWithRoles(
    id: UserRecord['id'],
  ): Promise<User | null> {
    const row = await this.prisma.user.findUnique({
      where: {
        id,
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
      active: row.active,
      createdAt: row.created_at,
      deletedAt: row.deleted_at ?? undefined,
      externalId: row.external_id,
      firstName: row.first_name ?? undefined,
      id: row.id,
      lastName: row.last_name ?? undefined,
      secondName: row.second_name ?? undefined,
      tenantId: row.tenant_id,
      updatedAt: row.updated_at,
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
        external_id: record.externalId,
        active: record.active,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        first_name: record.firstName,
        second_name: record.secondName,
        last_name: record.lastName,
        deleted_at: record.deletedAt,
        tenant_id: record.tenantId,
        language: record.language,
        userRoles: {
          createMany: {
            data:
              user.roles?.map((role) => ({
                role_id: role.id,
                tenant_id: record.tenantId,
              })) ?? [],
          },
        },
      },
      update: {
        active: record.active,
        updated_at: record.updatedAt,
        first_name: record.firstName,
        second_name: record.secondName,
        last_name: record.lastName,
        deleted_at: record.deletedAt,
        language: record.language,
        ...(user.isEnrichedWithRoles()
          ? {
              userRoles: {
                deleteMany: {
                  tenant_id: record.tenantId,
                },
                createMany: {
                  data:
                    user.roles?.map((role) => ({
                      role_id: role.id,
                      tenant_id: record.tenantId,
                    })) ?? [],
                },
              },
            }
          : {}),
      },
    });

    return User.hydrate({
      active: row.active,
      createdAt: row.created_at,
      deletedAt: row.deleted_at ?? undefined,
      externalId: row.external_id,
      firstName: row.first_name ?? undefined,
      id: row.id,
      lastName: row.last_name ?? undefined,
      secondName: row.second_name ?? undefined,
      tenantId: row.tenant_id,
      updatedAt: row.updated_at,
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
