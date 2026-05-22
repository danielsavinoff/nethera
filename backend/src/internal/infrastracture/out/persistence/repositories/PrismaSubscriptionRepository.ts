import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { SubscriptionNotFoundException } from '../../../../application/exceptions/SubscriptionNotFoundException.js';
import {
  PaginatedRepositoryQuery,
  RepositoryQuery,
} from '../../../../application/models/RepositoryQuery.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  SubscriptionWith,
  SubscriptionRepository,
} from '../../../../application/ports/SubscriptionRepository.js';
import { SubscriptionPlan } from '../../../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanTranslation } from '../../../../domain/subscription/SubscriptionPlanTranslation.js';
import { Subscription } from '../../../../domain/subscription/Subscription.js';
import { SubscriptionRecord } from '../../../../domain/subscription/SubscriptionRecord.js';
import { SubscriptionPlanTranslationRecord } from '../../../../domain/subscription/SubscriptionPlanTranslationRecord.js';
import { PrismaBaseRepository } from '../base/PrismaBaseRepository.js';

type SubscriptionPlanTranslationRow = {
  id: string;
  subscription_plan_id: string;
  language: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

type SubscriptionPlanRow = {
  id: string;
  code: string;
  billing_interval: string;
  billing_interval_count: number;
  trial_days: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  translations: SubscriptionPlanTranslationRow[];
};

@Injectable()
export class PrismaSubscriptionRepository
  extends PrismaBaseRepository
  implements SubscriptionRepository
{
  private readonly fieldMaps = {
    subscriptions: {
      id: 'id',
      userId: 'user_id',
      subscriptionPlanId: 'subscription_plan_id',
      status: 'status',
      startedAt: 'started_at',
      expiresAt: 'expires_at',
      trialStartedAt: 'trial_started_at',
      trialEndsAt: 'trial_ends_at',
      cancelAtPeriodEnd: 'auto_renew',
      canceledAt: 'canceled_at',
      endedAt: 'ended_at',
      autoRenew: 'auto_renew',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<keyof SubscriptionRecord, string>,
    subscriptionPlanTranslations: {
      id: 'id',
      subscriptionPlanId: 'subscription_plan_id',
      language: 'language',
      name: 'name',
      description: 'description',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<
      keyof SubscriptionPlanTranslationRecord,
      string
    >,
  };

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async load(
    query: RepositoryQuery<SubscriptionRecord, SubscriptionWith>,
    transactionContext?: TransactionContext,
  ): Promise<Subscription | null> {
    const client = this.getClient(transactionContext);

    const row = await client.subscription.findFirst({
      ...(query.filter
        ? {
            where: this.buildWhere<
              SubscriptionRecord,
              Prisma.SubscriptionWhereInput
            >(query.filter, this.fieldMaps.subscriptions),
          }
        : {}),
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
      include: {
        subscriptionPlan: query.with?.subscriptionPlans
          ? {
              include: {
                translations: {
                  where:
                    typeof query.with?.subscriptionPlans !==
                      'boolean' &&
                    query.with?.subscriptionPlans.with
                      ?.subscriptionPlanTranslations &&
                    typeof query.with.subscriptionPlans.with
                      .subscriptionPlanTranslations !==
                      'boolean' &&
                    query.with.subscriptionPlans.with
                      .subscriptionPlanTranslations.filter
                      ? this.buildWhere<
                          SubscriptionPlanTranslationRecord,
                          Prisma.SubscriptionPlanTranslationWhereInput
                        >(
                          query.with.subscriptionPlans.with
                            .subscriptionPlanTranslations.filter,
                          this.fieldMaps
                            .subscriptionPlanTranslations,
                        )
                      : undefined,
                  orderBy: {
                    language: 'asc',
                  },
                },
              },
            }
          : false,
      },
    });

    if (!row) {
      return null;
    }

    const subscription = Subscription.hydrate({
      id: row.id,
      userId: row.user_id,
      subscriptionPlanId: row.subscription_plan_id,
      status: row.status,
      startedAt: row.started_at,
      expiresAt: row.expires_at ?? undefined,
      trialStartedAt: row.trial_started_at ?? undefined,
      trialEndsAt: row.trial_ends_at ?? undefined,
      cancelAtPeriodEnd: !row.auto_renew,
      canceledAt: row.canceled_at ?? undefined,
      endedAt: row.ended_at ?? undefined,
      autoRenew: row.auto_renew,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });

    if (!query.with?.subscriptionPlans) {
      return subscription;
    }

    const subscriptionPlan =
      row.subscriptionPlan as SubscriptionPlanRow;

    return subscription.withPlan(
      SubscriptionPlan.hydrate({
        id: subscriptionPlan.id,
        code: subscriptionPlan.code,
        billingInterval: subscriptionPlan.billing_interval,
        billingIntervalCount:
          subscriptionPlan.billing_interval_count,
        trialDays: subscriptionPlan.trial_days ?? undefined,
        active: subscriptionPlan.is_active,
        createdAt: subscriptionPlan.created_at,
        updatedAt: subscriptionPlan.updated_at,
      }).withTranslations(
        subscriptionPlan.translations.map((translation) =>
          SubscriptionPlanTranslation.hydrate({
            id: translation.id,
            subscriptionPlanId: translation.subscription_plan_id,
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

  async loadOrThrow(
    query: RepositoryQuery<SubscriptionRecord, SubscriptionWith>,
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
    query: PaginatedRepositoryQuery<
      SubscriptionRecord,
      SubscriptionWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<Subscription[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.subscription.findMany({
      ...(query.filter
        ? {
            where: this.buildWhere<
              SubscriptionRecord,
              Prisma.SubscriptionWhereInput
            >(query.filter, this.fieldMaps.subscriptions),
          }
        : {}),
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
      take: query.page?.limit,
      skip: query.page?.offset,
      include: {
        subscriptionPlan: query.with?.subscriptionPlans
          ? {
              include: {
                translations: {
                  where:
                    typeof query.with?.subscriptionPlans !==
                      'boolean' &&
                    query.with?.subscriptionPlans.with
                      ?.subscriptionPlanTranslations &&
                    typeof query.with.subscriptionPlans.with
                      .subscriptionPlanTranslations !==
                      'boolean' &&
                    query.with.subscriptionPlans.with
                      .subscriptionPlanTranslations.filter
                      ? this.buildWhere<
                          SubscriptionPlanTranslationRecord,
                          Prisma.SubscriptionPlanTranslationWhereInput
                        >(
                          query.with.subscriptionPlans.with
                            .subscriptionPlanTranslations.filter,
                          this.fieldMaps
                            .subscriptionPlanTranslations,
                        )
                      : undefined,
                  orderBy: {
                    language: 'asc',
                  },
                },
              },
            }
          : false,
      },
    });

    return rows.map((row) => {
      const subscription = Subscription.hydrate({
        id: row.id,
        userId: row.user_id,
        subscriptionPlanId: row.subscription_plan_id,
        status: row.status,
        startedAt: row.started_at,
        expiresAt: row.expires_at ?? undefined,
        trialStartedAt: row.trial_started_at ?? undefined,
        trialEndsAt: row.trial_ends_at ?? undefined,
        cancelAtPeriodEnd: !row.auto_renew,
        canceledAt: row.canceled_at ?? undefined,
        endedAt: row.ended_at ?? undefined,
        autoRenew: row.auto_renew,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });

      if (!query.with?.subscriptionPlans) {
        return subscription;
      }

      const subscriptionPlan =
        row.subscriptionPlan as SubscriptionPlanRow;

      return subscription.withPlan(
        SubscriptionPlan.hydrate({
          id: subscriptionPlan.id,
          code: subscriptionPlan.code,
          billingInterval: subscriptionPlan.billing_interval,
          billingIntervalCount:
            subscriptionPlan.billing_interval_count,
          trialDays: subscriptionPlan.trial_days ?? undefined,
          active: subscriptionPlan.is_active,
          createdAt: subscriptionPlan.created_at,
          updatedAt: subscriptionPlan.updated_at,
        }).withTranslations(
          subscriptionPlan.translations.map((translation) =>
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
    });
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
        expires_at: record.expiresAt,
        trial_started_at: record.trialStartedAt,
        trial_ends_at: record.trialEndsAt,
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
        expires_at: record.expiresAt,
        trial_started_at: record.trialStartedAt,
        trial_ends_at: record.trialEndsAt,
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
      expiresAt: row.expires_at ?? undefined,
      trialStartedAt: row.trial_started_at ?? undefined,
      trialEndsAt: row.trial_ends_at ?? undefined,
      cancelAtPeriodEnd: !row.auto_renew,
      canceledAt: row.canceled_at ?? undefined,
      endedAt: row.ended_at ?? undefined,
      autoRenew: row.auto_renew,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
