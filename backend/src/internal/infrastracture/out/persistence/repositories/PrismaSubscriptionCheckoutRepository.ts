import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { SubscriptionCheckoutRepository } from '../../../../application/ports/SubscriptionCheckoutRepository.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { SubscriptionCheckout } from '../../../../domain/subscription/SubscriptionCheckout.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaSubscriptionCheckoutRepository implements SubscriptionCheckoutRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(
    subscriptionCheckout: SubscriptionCheckout,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionCheckout> {
    const client = this.getClient(transactionContext);

    const record = subscriptionCheckout.toRecord();

    const row = await client.subscriptionCheckout.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        user_id: record.userId,
        plan_id: record.planId,
        status: record.status,
        provider: record.provider,
        provider_session_id: record.providerSessionId,
        checkout_url: record.checkoutUrl,
        expires_at: record.expiresAt,
        completed_at: record.completedAt,
        failed_at: record.failedAt,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        user_id: record.userId,
        plan_id: record.planId,
        status: record.status,
        provider: record.provider,
        provider_session_id: record.providerSessionId,
        checkout_url: record.checkoutUrl,
        expires_at: record.expiresAt,
        completed_at: record.completedAt,
        failed_at: record.failedAt,
        updated_at: record.updatedAt,
      },
    });

    return SubscriptionCheckout.hydrate({
      id: row.id,
      userId: row.user_id,
      planId: row.plan_id,
      status: row.status,
      provider: row.provider,
      providerSessionId: row.provider_session_id ?? undefined,
      checkoutUrl: row.checkout_url ?? undefined,
      expiresAt: row.expires_at ?? undefined,
      completedAt: row.completed_at ?? undefined,
      failedAt: row.failed_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
