import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { VpnSubscriptionNotFoundException } from '../../../../application/exceptions/VpnSubscriptionNotFoundException.js';
import { RepositoryQuery } from '../../../../application/models/RepositoryQuery.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type { VpnSubscriptionRepository } from '../../../../application/ports/VpnSubscriptionRepository.js';
import { VpnSubscription } from '../../../../domain/subscription/VpnSubscription.js';
import { VpnSubscriptionRecord } from '../../../../domain/subscription/VpnSubscriptionRecord.js';
import { PrismaBaseRepository } from '../base/PrismaBaseRepository.js';

@Injectable()
export class PrismaVpnSubscriptionRepository
  extends PrismaBaseRepository
  implements VpnSubscriptionRepository
{
  private readonly fieldMaps = {
    vpnSubscriptions: {
      id: 'id',
      provider: 'provider',
      externalId: 'external_id',
      subscriptionUrl: 'subscription_url',
      userId: 'user_id',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<keyof VpnSubscriptionRecord, string>,
  };

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async load(
    query: RepositoryQuery<VpnSubscriptionRecord>,
    transactionContext?: TransactionContext,
  ): Promise<VpnSubscription | null> {
    const client = this.getClient(transactionContext);

    const row = await client.vpnSubscription.findFirst({
      where: query.filter
        ? this.buildWhere<
            VpnSubscriptionRecord,
            Prisma.VpnSubscriptionWhereInput
          >(query.filter, this.fieldMaps.vpnSubscriptions)
        : undefined,
    });

    return row
      ? VpnSubscription.hydrate({
          id: row.id,
          provider: row.provider,
          externalId: row.external_id,
          subscriptionUrl: row.subscription_url,
          userId: row.user_id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
      : null;
  }

  async loadOrThrow(
    query: RepositoryQuery<VpnSubscriptionRecord>,
    transactionContext?: TransactionContext,
  ): Promise<VpnSubscription> {
    const vpnSubscription = await this.load(
      query,
      transactionContext,
    );

    if (!vpnSubscription) {
      throw new VpnSubscriptionNotFoundException();
    }

    return vpnSubscription;
  }

  async save(
    vpnSubscription: VpnSubscription,
    transactionContext?: TransactionContext,
  ): Promise<VpnSubscription> {
    const client = this.getClient(transactionContext);

    const record = vpnSubscription.toRecord();

    const row = await client.vpnSubscription.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        provider: record.provider,
        external_id: record.externalId,
        subscription_url: record.subscriptionUrl,
        user_id: record.userId,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        provider: record.provider,
        external_id: record.externalId,
        subscription_url: record.subscriptionUrl,
        user_id: record.userId,
        updated_at: record.updatedAt,
      },
    });

    return VpnSubscription.hydrate({
      id: row.id,
      provider: row.provider,
      externalId: row.external_id,
      subscriptionUrl: row.subscription_url,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async delete(
    query: RepositoryQuery<VpnSubscriptionRecord>,
    transactionContext?: TransactionContext,
  ): Promise<void> {
    const client = this.getClient(transactionContext);

    await client.vpnSubscription.deleteMany({
      where: query.filter
        ? this.buildWhere<
            VpnSubscriptionRecord,
            Prisma.VpnSubscriptionWhereInput
          >(query.filter, this.fieldMaps.vpnSubscriptions)
        : undefined,
    });
  }
}
