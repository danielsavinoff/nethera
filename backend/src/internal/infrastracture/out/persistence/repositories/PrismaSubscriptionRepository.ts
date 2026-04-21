import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SubscriptionNotFoundException } from '../../../../application/exceptions/SubscriptionNotFoundException.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  LoadSubscriptionQuery,
  SubscriptionRepository,
} from '../../../../application/ports/SubscriptionRepository.js';
import { Subscription } from '../../../../domain/subscription/Subscription.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadSubscriptionQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription | null> {
    const client = this.getClient(transactionContext);

    const row = await client.subscription.findUnique({
      where: {
        id: query.filters.id,
      },
    });

    if (!row) {
      return null;
    }

    return Subscription.hydrate({
      id: row.id,
      userId: row.user_id,
      planId: row.plan_id,
      status: row.status,
      startedAt: row.started_at,
      currentPeriodStartAt:
        row.current_period_start_at ?? undefined,
      currentPeriodEndAt: row.current_period_end_at ?? undefined,
      trialStartedAt: row.trial_started_at ?? undefined,
      trialEndsAt: row.trial_ends_at ?? undefined,
      cancelAtPeriodEnd: row.cancel_at_period_end,
      canceledAt: row.canceled_at ?? undefined,
      endedAt: row.ended_at ?? undefined,
      autoRenew: row.auto_renew,
      provider: row.provider ?? undefined,
      providerCustomerId: row.provider_customer_id ?? undefined,
      providerSubscriptionId:
        row.provider_subscription_id ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async loadOrThrow(
    query: LoadSubscriptionQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription> {
    const subscription = await this.load(
      query,
      transactionContext,
    );

    if (!subscription) {
      throw new SubscriptionNotFoundException();
    }

    return subscription;
  }

  async save(
    subscription: Subscription,
    transactionContext?: TransactionContext,
  ): Promise<Subscription> {
    const client = this.getClient(transactionContext);

    const record = subscription.toRecord();

    const row = await client.subscription.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        user_id: record.userId,
        plan_id: record.planId,
        status: record.status,
        started_at: record.startedAt,
        current_period_start_at: record.currentPeriodStartAt,
        current_period_end_at: record.currentPeriodEndAt,
        trial_started_at: record.trialStartedAt,
        trial_ends_at: record.trialEndsAt,
        cancel_at_period_end: record.cancelAtPeriodEnd,
        canceled_at: record.canceledAt,
        ended_at: record.endedAt,
        auto_renew: record.autoRenew,
        provider: record.provider,
        provider_customer_id: record.providerCustomerId,
        provider_subscription_id: record.providerSubscriptionId,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        user_id: record.userId,
        plan_id: record.planId,
        status: record.status,
        started_at: record.startedAt,
        current_period_start_at: record.currentPeriodStartAt,
        current_period_end_at: record.currentPeriodEndAt,
        trial_started_at: record.trialStartedAt,
        trial_ends_at: record.trialEndsAt,
        cancel_at_period_end: record.cancelAtPeriodEnd,
        canceled_at: record.canceledAt,
        ended_at: record.endedAt,
        auto_renew: record.autoRenew,
        provider: record.provider,
        provider_customer_id: record.providerCustomerId,
        provider_subscription_id: record.providerSubscriptionId,
        updated_at: record.updatedAt,
      },
    });

    return Subscription.hydrate({
      id: row.id,
      userId: row.user_id,
      planId: row.plan_id,
      status: row.status,
      startedAt: row.started_at,
      currentPeriodStartAt:
        row.current_period_start_at ?? undefined,
      currentPeriodEndAt: row.current_period_end_at ?? undefined,
      trialStartedAt: row.trial_started_at ?? undefined,
      trialEndsAt: row.trial_ends_at ?? undefined,
      cancelAtPeriodEnd: row.cancel_at_period_end,
      canceledAt: row.canceled_at ?? undefined,
      endedAt: row.ended_at ?? undefined,
      autoRenew: row.auto_renew,
      provider: row.provider ?? undefined,
      providerCustomerId: row.provider_customer_id ?? undefined,
      providerSubscriptionId:
        row.provider_subscription_id ?? undefined,
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
