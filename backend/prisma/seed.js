import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';
import { env } from 'prisma/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Permission } from '../dist/src/internal/domain/authorization/Permission.js';
import { UserRole } from '../dist/src/internal/domain/authorization/UserRole.js';
import { expand } from 'dotenv-expand';

expand(dotenv.config({ path: path.resolve('../../.env') }));

const server = env('DATABASE_SERVER');
const user = env('DATABASE_USER');
const pass = env('DATABASE_PASS');
const host = env('DATABASE_HOST');
const port = env('DATABASE_PORT');
const db = env('DATABASE');

const connectionString = `${server}://${user}:${pass}@${host}:${port}/${db}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const permissionNames = Object.values(Permission);

  const userPermissionNames = [
    Permission.SubscriptionViewOwn,
    Permission.SubscriptionInvoiceViewOwn,
    Permission.UserRoleViewOwn,
    Permission.UserViewOwn,
  ];

  const adminPermissionNames = [
    Permission.PlanViewAny,
    Permission.PlanAddAny,
    Permission.SubscriptionViewAny,
    Permission.SubscriptionInvoiceViewAny,
    Permission.UserRoleViewAny,
    Permission.UserRoleUpdateAny,
    Permission.UserRoleDeleteAny,
  ];

  await prisma.role.upsert({
    where: {
      name: UserRole.User,
    },
    create: {
      name: UserRole.User,
    },
    update: {},
  });

  await prisma.role.upsert({
    where: {
      name: UserRole.Admin,
    },
    create: {
      name: UserRole.Admin,
    },
    update: {},
  });

  for (const permissionName of permissionNames) {
    await prisma.permission.upsert({
      where: {
        name: permissionName,
      },
      create: {
        name: permissionName,
      },
      update: {},
    });
  }

  const userRole = await prisma.role.findUniqueOrThrow({
    where: {
      name: UserRole.User,
    },
  });

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: {
      name: UserRole.Admin,
    },
  });

  const permissions = await prisma.permission.findMany({
    where: {
      name: {
        in: permissionNames,
      },
    },
  });

  const permissionsByName = new Map(
    permissions.map((permission) => [
      permission.name,
      permission,
    ]),
  );

  const rolePermissions = [
    ...userPermissionNames.map((permissionName) => ({
      roleId: userRole.id,
      permissionId: permissionsByName.get(permissionName)?.id,
    })),
    ...adminPermissionNames.map((permissionName) => ({
      roleId: adminRole.id,
      permissionId: permissionsByName.get(permissionName)?.id,
    })),
  ];

  for (const rolePermission of rolePermissions) {
    if (!rolePermission.permissionId) {
      throw new Error('Default permissions must exist.');
    }

    await prisma.permissionOnRole.upsert({
      where: {
        role_id_permission_id: {
          role_id: rolePermission.roleId,
          permission_id: rolePermission.permissionId,
        },
      },
      create: {
        role_id: rolePermission.roleId,
        permission_id: rolePermission.permissionId,
      },
      update: {},
    });
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
