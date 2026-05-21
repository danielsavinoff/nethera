import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SubscriptionNotFoundException } from '../../../../application/exceptions/SubscriptionNotFoundException.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  LoadSubscriptionQuery,
  LoadSubscriptionsQuery,
  SubscriptionRepository,
} from '../../../../application/ports/SubscriptionRepository.js';
import { SubscriptionPlan } from '../../../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanTranslation } from '../../../../domain/subscription/SubscriptionPlanTranslation.js';
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

    const where = {
      ...(query.filters.id
        ? {
            id: query.filters.id,
          }
        : {}),
      ...(query.filters.userId
        ? {
            user_id: query.filters.userId,
          }
        : {}),
      ...(query.filters.status
        ? {
            status: query.filters.status,
          }
        : {}),
    };

    if (query.with?.subscriptionPlan) {
      const row = await client.subscription.findFirst({
        where,
        orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
        include: {
          subscriptionPlan: {
            include: {
              translations: {
                where: {
                  language:
                    query.with.subscriptionPlan
                      .translationLanguage,
                },
                orderBy: {
                  language: 'asc',
                },
              },
            },
          },
        },
      });

      if (!row) {
        return null;
      }

      return Subscription.hydrate({
        id: row.id,
        userId: row.user_id,
        subscriptionPlanId: row.subscription_plan_id,
        status: row.status,
        startedAt: row.started_at,
        currentPeriodStartAt:
          row.current_period_start_at ?? undefined,
        currentPeriodEndAt:
          row.current_period_end_at ?? undefined,
        trialStartedAt: row.trial_started_at ?? undefined,
        trialEndsAt: row.trial_ends_at ?? undefined,
        cancelAtPeriodEnd: row.cancel_at_period_end,
        canceledAt: row.canceled_at ?? undefined,
        endedAt: row.ended_at ?? undefined,
        autoRenew: row.auto_renew,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }).withPlan(
        SubscriptionPlan.hydrate({
          id: row.subscriptionPlan.id,
          code: row.subscriptionPlan.code,
          billingInterval: row.subscriptionPlan.billing_interval,
          billingIntervalCount:
            row.subscriptionPlan.billing_interval_count,
          trialDays:
            row.subscriptionPlan.trial_days ?? undefined,
          active: row.subscriptionPlan.is_active,
          createdAt: row.subscriptionPlan.created_at,
          updatedAt: row.subscriptionPlan.updated_at,
        }).withTranslations(
          row.subscriptionPlan.translations.map((translation) =>
            SubscriptionPlanTranslation.hydrate({
              id: translation.id,
              subscriptionPlanId:
                translation.subscription_plan_id,
              language: translation.language,
              name: translation.name,
              description: translation.description ?? undefined,
              createdAt: translation.created_at,
              updatedAt: translation.updated_at,
            }),
          ),
        ),
      );
    }

    const row = await client.subscription.findFirst({
      where,
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
    });

    if (!row) {
      return null;
    }

    return Subscription.hydrate({
      id: row.id,
      userId: row.user_id,
      subscriptionPlanId: row.subscription_plan_id,
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

  async loadMany(
    query: LoadSubscriptionsQuery,
    transactionContext?: TransactionContext,
  ): Promise<Subscription[]> {
    const client = this.getClient(transactionContext);

    const where = {
      ...(query.filters?.userId
        ? {
            user_id: query.filters.userId,
          }
        : {}),
      ...(query.filters?.status
        ? {
            status: query.filters.status,
          }
        : {}),
    };

    if (query.with?.subscriptionPlan) {
      const rows = await client.subscription.findMany({
        where,
        orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
        include: {
          subscriptionPlan: {
            include: {
              translations: {
                where: {
                  language:
                    query.with.subscriptionPlan
                      .translationLanguage,
                },
                orderBy: {
                  language: 'asc',
                },
              },
            },
          },
        },
      });

      return rows.map((row) =>
        Subscription.hydrate({
          id: row.id,
          userId: row.user_id,
          subscriptionPlanId: row.subscription_plan_id,
          status: row.status,
          startedAt: row.started_at,
          currentPeriodStartAt:
            row.current_period_start_at ?? undefined,
          currentPeriodEndAt:
            row.current_period_end_at ?? undefined,
          trialStartedAt: row.trial_started_at ?? undefined,
          trialEndsAt: row.trial_ends_at ?? undefined,
          cancelAtPeriodEnd: row.cancel_at_period_end,
          canceledAt: row.canceled_at ?? undefined,
          endedAt: row.ended_at ?? undefined,
          autoRenew: row.auto_renew,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }).withPlan(
          SubscriptionPlan.hydrate({
            id: row.subscriptionPlan.id,
            code: row.subscriptionPlan.code,
            billingInterval:
              row.subscriptionPlan.billing_interval,
            billingIntervalCount:
              row.subscriptionPlan.billing_interval_count,
            trialDays:
              row.subscriptionPlan.trial_days ?? undefined,
            active: row.subscriptionPlan.is_active,
            createdAt: row.subscriptionPlan.created_at,
            updatedAt: row.subscriptionPlan.updated_at,
          }).withTranslations(
            row.subscriptionPlan.translations.map(
              (translation) =>
                SubscriptionPlanTranslation.hydrate({
                  id: translation.id,
                  subscriptionPlanId:
                    translation.subscription_plan_id,
                  language: translation.language,
                  name: translation.name,
                  description:
                    translation.description ?? undefined,
                  createdAt: translation.created_at,
                  updatedAt: translation.updated_at,
                }),
            ),
          ),
        ),
      );
    }

    const rows = await client.subscription.findMany({
      where,
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
    });

    return rows.map((row) =>
      Subscription.hydrate({
        id: row.id,
        userId: row.user_id,
        subscriptionPlanId: row.subscription_plan_id,
        status: row.status,
        startedAt: row.started_at,
        currentPeriodStartAt:
          row.current_period_start_at ?? undefined,
        currentPeriodEndAt:
          row.current_period_end_at ?? undefined,
        trialStartedAt: row.trial_started_at ?? undefined,
        trialEndsAt: row.trial_ends_at ?? undefined,
        cancelAtPeriodEnd: row.cancel_at_period_end,
        canceledAt: row.canceled_at ?? undefined,
        endedAt: row.ended_at ?? undefined,
        autoRenew: row.auto_renew,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }),
    );
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
        subscription_plan_id: record.subscriptionPlanId,
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
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        user_id: record.userId,
        subscription_plan_id: record.subscriptionPlanId,
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
        updated_at: record.updatedAt,
      },
    });

    return Subscription.hydrate({
      id: row.id,
      userId: row.user_id,
      subscriptionPlanId: row.subscription_plan_id,
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
