import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UnknownTenantException } from '../../../../application/exceptions/UnknownTenantException.js';
import { TenantId } from '../../../../domain/tenant/TenantRecord.js';
import { TenantRepository } from '../../../../application/ports/TenantRepository.js';
import { Tenant } from '../../../../domain/tenant/Tenant.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaTenantRepository implements TenantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadByMemberId(
    memberId: string,
    transactionContext?: TransactionContext,
  ): Promise<Tenant | null> {
    const client = this.getClient(transactionContext);

    const row = await client.tenant.findUnique({
      where: {
        member_id: memberId,
      },
    });

    if (!row) {
      return null;
    }

    return Tenant.hydrate({
      id: row.id,
      domain: row.domain,
      memberId: row.member_id,
      isAdmin: row.is_admin,
      refreshToken: row.refresh_token,
      accessToken: row.access_token,
      accessTokenTtlSeconds: row.access_token_ttl_seconds,
      accessTokenRefreshedAt: row.access_token_refreshed_at,
      isInstalled: row.is_installed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      serverEndpoint: row.server_endpoint ?? undefined,
      clientEndpoint: row.client_endpoint ?? undefined,
      applicationToken: row.application_token ?? undefined,
    });
  }

  async save(
    tenant: Tenant,
    transactionContext?: TransactionContext,
  ): Promise<Tenant> {
    const client = this.getClient(transactionContext);
    const record = tenant.toRecord();

    const row = await client.tenant.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        domain: record.domain,
        member_id: record.memberId,
        is_admin: record.isAdmin,
        refresh_token: record.refreshToken,
        access_token: record.accessToken,
        access_token_ttl_seconds: record.accessTokenTtlSeconds,
        access_token_refreshed_at: record.accessTokenRefreshedAt,
        is_installed: record.isInstalled,
        server_endpoint: record.serverEndpoint,
        client_endpoint: record.clientEndpoint,
        application_token: record.applicationToken,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        domain: record.domain,
        member_id: record.memberId,
        is_admin: record.isAdmin,
        refresh_token: record.refreshToken,
        access_token: record.accessToken,
        access_token_ttl_seconds: record.accessTokenTtlSeconds,
        access_token_refreshed_at: record.accessTokenRefreshedAt,
        is_installed: record.isInstalled,
        server_endpoint: record.serverEndpoint,
        client_endpoint: record.clientEndpoint,
        application_token: record.applicationToken,
        updated_at: record.updatedAt,
      },
    });

    return Tenant.hydrate({
      id: row.id,
      domain: row.domain,
      memberId: row.member_id,
      isAdmin: row.is_admin,
      refreshToken: row.refresh_token,
      accessToken: row.access_token,
      accessTokenTtlSeconds: row.access_token_ttl_seconds,
      accessTokenRefreshedAt: row.access_token_refreshed_at,
      isInstalled: row.is_installed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      serverEndpoint: row.server_endpoint ?? undefined,
      clientEndpoint: row.client_endpoint ?? undefined,
      applicationToken: row.application_token ?? undefined,
    });
  }
  async loadByIdOrThrow(id: string): Promise<Tenant> {
    const row = await this.prisma.tenant.findUnique({
      where: {
        id: id,
      },
    });

    if (!row) {
      throw new UnknownTenantException();
    }

    return Tenant.hydrate({
      id: row.id,
      domain: row.domain,
      memberId: row.member_id,
      isAdmin: row.is_admin,
      refreshToken: row.refresh_token,
      accessToken: row.access_token,
      accessTokenTtlSeconds: row.access_token_ttl_seconds,
      accessTokenRefreshedAt: row.access_token_refreshed_at,
      isInstalled: row.is_installed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      serverEndpoint: row.server_endpoint ?? undefined,
      clientEndpoint: row.client_endpoint ?? undefined,
      applicationToken: row.application_token ?? undefined,
    });
  }

  async findInstalledTenantIds(): Promise<TenantId[]> {
    const rows = await this.prisma.tenant.findMany({
      where: {
        is_installed: true,
      },
      select: {
        id: true,
      },
    });

    return rows.map((row) => row.id);
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
