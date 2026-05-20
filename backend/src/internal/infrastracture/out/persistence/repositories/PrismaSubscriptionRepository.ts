import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SubscriptionNotFoundException } from '../../../../application/exceptions/SubscriptionNotFoundException.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  LoadSubscriptionQuery,
  LoadSubscriptionsQuery,
  SubscriptionRepository,
} from '../../../../application/ports/SubscriptionRepository.js';
import { Plan } from '../../../../domain/subscription/Plan.js';
import { PlanTranslation } from '../../../../domain/subscription/PlanTranslation.js';
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

    if (query.with?.plan) {
      const row = await client.subscription.findFirst({
        where,
        orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
        include: {
          plan: {
            include: {
              translations: {
                where: {
                  language: query.with.plan.translationLanguage,
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
        planId: row.plan_id,
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
        Plan.hydrate({
          id: row.plan.id,
          code: row.plan.code,
          priceAmount: row.plan.price_amount.toString(),
          priceCurrency: row.plan.price_currency,
          billingInterval: row.plan.billing_interval,
          billingIntervalCount: row.plan.billing_interval_count,
          trialDays: row.plan.trial_days ?? undefined,
          active: row.plan.is_active,
          createdAt: row.plan.created_at,
          updatedAt: row.plan.updated_at,
        }).withTranslations(
          row.plan.translations.map((translation) =>
            PlanTranslation.hydrate({
              id: translation.id,
              planId: translation.plan_id,
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

    if (query.with?.plan) {
      const rows = await client.subscription.findMany({
        where,
        orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
        include: {
          plan: {
            include: {
              translations: {
                where: {
                  language: query.with.plan.translationLanguage,
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
          planId: row.plan_id,
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
          Plan.hydrate({
            id: row.plan.id,
            code: row.plan.code,
            priceAmount: row.plan.price_amount.toString(),
            priceCurrency: row.plan.price_currency,
            billingInterval: row.plan.billing_interval,
            billingIntervalCount:
              row.plan.billing_interval_count,
            trialDays: row.plan.trial_days ?? undefined,
            active: row.plan.is_active,
            createdAt: row.plan.created_at,
            updatedAt: row.plan.updated_at,
          }).withTranslations(
            row.plan.translations.map((translation) =>
              PlanTranslation.hydrate({
                id: translation.id,
                planId: translation.plan_id,
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
        planId: row.plan_id,
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
