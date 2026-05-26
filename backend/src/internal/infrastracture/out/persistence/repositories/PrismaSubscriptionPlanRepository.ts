import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { SubscriptionPlanNotFoundException } from '../../../../application/exceptions/SubscriptionPlanNotFoundException.js';
import {
  PaginatedRepositoryQuery,
  RepositoryQuery,
} from '../../../../application/models/RepositoryQuery.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  SubscriptionPlanRepository,
  SubscriptionPlanWith,
} from '../../../../application/ports/SubscriptionPlanRepository.js';
import { SubscriptionPlan } from '../../../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanFeature } from '../../../../domain/subscription/SubscriptionPlanFeature.js';
import { SubscriptionPlanFeatureRecord } from '../../../../domain/subscription/SubscriptionPlanFeatureRecord.js';
import { SubscriptionPlanFeatureTranslation } from '../../../../domain/subscription/SubscriptionPlanFeatureTranslation.js';
import { SubscriptionPlanFeatureTranslationRecord } from '../../../../domain/subscription/SubscriptionPlanFeatureTranslationRecord.js';
import { SubscriptionPlanTranslation } from '../../../../domain/subscription/SubscriptionPlanTranslation.js';
import { SubscriptionPlanTranslationRecord } from '../../../../domain/subscription/SubscriptionPlanTranslationRecord.js';
import { SubscriptionPrice } from '../../../../domain/subscription/SubscriptionPrice.js';
import { SubscriptionPriceRecord } from '../../../../domain/subscription/SubscriptionPriceRecord.js';
import { PrismaBaseRepository } from '../base/PrismaBaseRepository.js';
import { SubscriptionPlanRecord } from '../../../../domain/subscription/SubscriptionPlanRecord.js';

@Injectable()
export class PrismaSubscriptionPlanRepository
  extends PrismaBaseRepository
  implements SubscriptionPlanRepository
{
  private readonly fieldMaps = {
    subscriptionPlans: {
      id: 'id',
      code: 'code',
      billingInterval: 'billing_interval',
      billingIntervalCount: 'billing_interval_count',
      trialDays: 'trial_days',
      isPublic: 'is_public',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<keyof SubscriptionPlanRecord, string>,
    subscriptionPlanTranslations: {
      id: 'id',
      subscriptionPlanId: 'subscription_plan_id',
      locale: 'locale',
      name: 'name',
      description: 'description',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<
      keyof SubscriptionPlanTranslationRecord,
      string
    >,
    subscriptionPlanFeatures: {
      id: 'id',
      subscriptionPlanId: 'subscription_plan_id',
      code: 'code',
      value: 'value',
      sortOrder: 'sort_order',
      active: 'is_active',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<
      keyof SubscriptionPlanFeatureRecord,
      string
    >,
    subscriptionPlanFeatureTranslations: {
      id: 'id',
      subscriptionPlanFeatureId: 'subscription_plan_feature_id',
      locale: 'locale',
      title: 'title',
      description: 'description',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<
      keyof SubscriptionPlanFeatureTranslationRecord,
      string
    >,
    subscriptionPrices: {
      id: 'id',
      subscriptionPlanId: 'subscription_plan_id',
      amountMinor: 'amount_minor',
      currencyCode: 'currency_code',
      active: 'is_active',
      createdAt: 'created_at',
    } satisfies Record<keyof SubscriptionPriceRecord, string>,
  };

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async load(
    query: RepositoryQuery<
      SubscriptionPlanRecord,
      SubscriptionPlanWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan | null> {
    const client = this.getClient(transactionContext);

    const row = await client.subscriptionPlan.findFirst({
      ...(query.filter
        ? {
            where: this.buildWhere<
              SubscriptionPlanRecord,
              Prisma.SubscriptionPlanWhereInput
            >(query.filter, this.fieldMaps.subscriptionPlans),
          }
        : {}),
      orderBy: [{ code: 'asc' }, { id: 'asc' }],
      include: {
        translations: query.with?.subscriptionPlanTranslations
          ? {
              where:
                typeof query.with
                  .subscriptionPlanTranslations !== 'boolean' &&
                query.with.subscriptionPlanTranslations.filter
                  ? this.buildWhere<
                      SubscriptionPlanTranslationRecord,
                      Prisma.SubscriptionPlanTranslationWhereInput
                    >(
                      query.with.subscriptionPlanTranslations
                        .filter,
                      this.fieldMaps
                        .subscriptionPlanTranslations,
                    )
                  : undefined,
              orderBy: {
                locale: 'asc',
              },
            }
          : false,
        features: query.with?.subscriptionPlanFeatures
          ? {
              where:
                typeof query.with.subscriptionPlanFeatures !==
                  'boolean' &&
                query.with.subscriptionPlanFeatures.filter
                  ? this.buildWhere<
                      SubscriptionPlanFeatureRecord,
                      Prisma.SubscriptionPlanFeatureWhereInput
                    >(
                      query.with.subscriptionPlanFeatures.filter,
                      this.fieldMaps.subscriptionPlanFeatures,
                    )
                  : undefined,
              orderBy: [
                {
                  sort_order: 'asc',
                },
                {
                  code: 'asc',
                },
              ],
              include: {
                translations: {
                  where:
                    typeof query.with
                      .subscriptionPlanFeatures !== 'boolean' &&
                    query.with.subscriptionPlanFeatures.with
                      ?.subscriptionPlanFeatureTranslations &&
                    typeof query.with.subscriptionPlanFeatures
                      .with
                      .subscriptionPlanFeatureTranslations !==
                      'boolean' &&
                    query.with.subscriptionPlanFeatures.with
                      .subscriptionPlanFeatureTranslations.filter
                      ? this.buildWhere<
                          SubscriptionPlanFeatureTranslationRecord,
                          Prisma.SubscriptionPlanFeatureTranslationWhereInput
                        >(
                          query.with.subscriptionPlanFeatures
                            .with
                            .subscriptionPlanFeatureTranslations
                            .filter,
                          this.fieldMaps
                            .subscriptionPlanFeatureTranslations,
                        )
                      : undefined,
                  orderBy: {
                    locale: 'asc',
                  },
                },
              },
            }
          : false,
        prices: query.with?.subscriptionPrices
          ? {
              where:
                typeof query.with.subscriptionPrices !==
                  'boolean' &&
                query.with.subscriptionPrices.filter
                  ? this.buildWhere<
                      SubscriptionPriceRecord,
                      Prisma.SubscriptionPlanPriceWhereInput
                    >(
                      query.with.subscriptionPrices.filter,
                      this.fieldMaps.subscriptionPrices,
                    )
                  : undefined,
              orderBy: [
                {
                  is_active: 'desc',
                },
                {
                  currency_code: 'asc',
                },
                {
                  created_at: 'desc',
                },
              ],
              take: 1,
            }
          : false,
      },
    });

    if (!row) {
      return null;
    }

    return SubscriptionPlan.hydrate({
      id: row.id,
      code: row.code,
      billingInterval: row.billing_interval,
      billingIntervalCount: row.billing_interval_count,
      trialDays: row.trial_days ?? undefined,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
      .withTranslations(
        (row.translations ?? []).map((translation) =>
          SubscriptionPlanTranslation.hydrate({
            id: translation.id,
            subscriptionPlanId: translation.subscription_plan_id,
            locale: translation.locale,
            name: translation.name,
            description: translation.description ?? undefined,
            createdAt: translation.created_at,
            updatedAt: translation.updated_at,
          }),
        ),
      )
      .withFeatures(
        (row.features ?? []).map((feature) => {
          const translations =
            'translations' in feature
              ? (feature.translations as Prisma.SubscriptionPlanFeatureTranslationGetPayload<
                  Record<string, never>
                >[])
              : [];

          return SubscriptionPlanFeature.hydrate({
            id: feature.id,
            subscriptionPlanId: feature.subscription_plan_id,
            code: feature.code,
            value: feature.value ?? undefined,
            sortOrder: feature.sort_order,
            active: feature.is_active,
            createdAt: feature.created_at,
            updatedAt: feature.updated_at,
          }).withTranslations(
            translations.map((translation) =>
              SubscriptionPlanFeatureTranslation.hydrate({
                id: translation.id,
                subscriptionPlanFeatureId:
                  translation.subscription_plan_feature_id,
                locale: translation.locale,
                title: translation.title,
                description:
                  translation.description ?? undefined,
                createdAt: translation.created_at,
                updatedAt: translation.updated_at,
              }),
            ),
          );
        }),
      )
      .withPrices(
        (row.prices ?? []).map((price) =>
          SubscriptionPrice.hydrate({
            id: price.id,
            subscriptionPlanId: price.subscription_plan_id,
            amountMinor: price.amount_minor,
            currencyCode: price.currency_code,
            active: price.is_active,
            createdAt: price.created_at,
          }),
        ),
      );
  }

  async loadMany(
    query: PaginatedRepositoryQuery<
      SubscriptionPlanRecord,
      SubscriptionPlanWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.subscriptionPlan.findMany({
      ...(query.filter
        ? {
            where: this.buildWhere<
              SubscriptionPlanRecord,
              Prisma.SubscriptionPlanWhereInput
            >(query.filter, this.fieldMaps.subscriptionPlans),
          }
        : {}),
      orderBy: [{ code: 'asc' }, { id: 'asc' }],
      take: query.page?.limit,
      skip: query.page?.offset,
      include: {
        translations: query.with?.subscriptionPlanTranslations
          ? {
              where:
                typeof query.with
                  .subscriptionPlanTranslations !== 'boolean' &&
                query.with.subscriptionPlanTranslations.filter
                  ? this.buildWhere<
                      SubscriptionPlanTranslationRecord,
                      Prisma.SubscriptionPlanTranslationWhereInput
                    >(
                      query.with.subscriptionPlanTranslations
                        .filter,
                      this.fieldMaps
                        .subscriptionPlanTranslations,
                    )
                  : undefined,
              orderBy: {
                locale: 'asc',
              },
            }
          : false,
        features: query.with?.subscriptionPlanFeatures
          ? {
              where:
                typeof query.with.subscriptionPlanFeatures !==
                  'boolean' &&
                query.with.subscriptionPlanFeatures.filter
                  ? this.buildWhere<
                      SubscriptionPlanFeatureRecord,
                      Prisma.SubscriptionPlanFeatureWhereInput
                    >(
                      query.with.subscriptionPlanFeatures.filter,
                      this.fieldMaps.subscriptionPlanFeatures,
                    )
                  : undefined,
              orderBy: [
                {
                  sort_order: 'asc',
                },
                {
                  code: 'asc',
                },
              ],
              include: {
                translations: {
                  where:
                    typeof query.with
                      .subscriptionPlanFeatures !== 'boolean' &&
                    query.with.subscriptionPlanFeatures.with
                      ?.subscriptionPlanFeatureTranslations &&
                    typeof query.with.subscriptionPlanFeatures
                      .with
                      .subscriptionPlanFeatureTranslations !==
                      'boolean' &&
                    query.with.subscriptionPlanFeatures.with
                      .subscriptionPlanFeatureTranslations.filter
                      ? this.buildWhere<
                          SubscriptionPlanFeatureTranslationRecord,
                          Prisma.SubscriptionPlanFeatureTranslationWhereInput
                        >(
                          query.with.subscriptionPlanFeatures
                            .with
                            .subscriptionPlanFeatureTranslations
                            .filter,
                          this.fieldMaps
                            .subscriptionPlanFeatureTranslations,
                        )
                      : undefined,
                  orderBy: {
                    locale: 'asc',
                  },
                },
              },
            }
          : false,
        prices: query.with?.subscriptionPrices
          ? {
              where:
                typeof query.with.subscriptionPrices !==
                  'boolean' &&
                query.with.subscriptionPrices.filter
                  ? this.buildWhere<
                      SubscriptionPriceRecord,
                      Prisma.SubscriptionPlanPriceWhereInput
                    >(
                      query.with.subscriptionPrices.filter,
                      this.fieldMaps.subscriptionPrices,
                    )
                  : undefined,
              orderBy: [
                {
                  is_active: 'desc',
                },
                {
                  currency_code: 'asc',
                },
                {
                  created_at: 'desc',
                },
              ],
              take: 1,
            }
          : false,
      },
    });

    return rows.map((row) => {
      return SubscriptionPlan.hydrate({
        id: row.id,
        code: row.code,
        billingInterval: row.billing_interval,
        billingIntervalCount: row.billing_interval_count,
        trialDays: row.trial_days ?? undefined,
        isPublic: row.is_public,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
        .withTranslations(
          (row.translations ?? []).map((translation) =>
            SubscriptionPlanTranslation.hydrate({
              id: translation.id,
              subscriptionPlanId:
                translation.subscription_plan_id,
              locale: translation.locale,
              name: translation.name,
              description: translation.description ?? undefined,
              createdAt: translation.created_at,
              updatedAt: translation.updated_at,
            }),
          ),
        )
        .withFeatures(
          (row.features ?? []).map((feature) => {
            const translations =
              'translations' in feature
                ? (feature.translations as Prisma.SubscriptionPlanFeatureTranslationGetPayload<
                    Record<string, never>
                  >[])
                : [];

            return SubscriptionPlanFeature.hydrate({
              id: feature.id,
              subscriptionPlanId: feature.subscription_plan_id,
              code: feature.code,
              value: feature.value ?? undefined,
              sortOrder: feature.sort_order,
              active: feature.is_active,
              createdAt: feature.created_at,
              updatedAt: feature.updated_at,
            }).withTranslations(
              translations.map((translation) =>
                SubscriptionPlanFeatureTranslation.hydrate({
                  id: translation.id,
                  subscriptionPlanFeatureId:
                    translation.subscription_plan_feature_id,
                  locale: translation.locale,
                  title: translation.title,
                  description:
                    translation.description ?? undefined,
                  createdAt: translation.created_at,
                  updatedAt: translation.updated_at,
                }),
              ),
            );
          }),
        )
        .withPrices(
          (row.prices ?? []).map((price) =>
            SubscriptionPrice.hydrate({
              id: price.id,
              subscriptionPlanId: price.subscription_plan_id,
              amountMinor: price.amount_minor,
              currencyCode: price.currency_code,
              active: price.is_active,
              createdAt: price.created_at,
            }),
          ),
        );
    });
  }

  async loadOrThrow(
    query: RepositoryQuery<
      SubscriptionPlanRecord,
      SubscriptionPlanWith
    >,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan> {
    const subscriptionPlan = await this.load(
      query,
      transactionContext,
    );

    if (!subscriptionPlan) {
      throw new SubscriptionPlanNotFoundException();
    }

    return subscriptionPlan;
  }

  async save(
    subscriptionPlan: SubscriptionPlan,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan> {
    const client = this.getClient(transactionContext);

    const record = subscriptionPlan.toRecord();

    const translations = subscriptionPlan
      .getAllTranslations()
      .map((translation) => translation.toRecord());

    const features = subscriptionPlan
      .getAllFeatures()
      .map((feature) => ({
        record: feature.toRecord(),
        translations: feature
          .getAllTranslations()
          .map((translation) => translation.toRecord()),
      }));

    const prices = subscriptionPlan
      .getAllPrices()
      .map((price) => price.toRecord());

    const row = await client.subscriptionPlan.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        code: record.code,
        billing_interval: record.billingInterval,
        billing_interval_count: record.billingIntervalCount,
        trial_days: record.trialDays,
        is_public: record.isPublic,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        translations: {
          create: translations.map((translation) => ({
            id: translation.id,
            locale: translation.locale,
            name: translation.name,
            description: translation.description,
            created_at: translation.createdAt,
            updated_at: translation.updatedAt,
          })),
        },
        features: {
          create: features.map((feature) => ({
            id: feature.record.id,
            code: feature.record.code,
            value: feature.record.value,
            sort_order: feature.record.sortOrder,
            is_active: feature.record.active,
            created_at: feature.record.createdAt,
            updated_at: feature.record.updatedAt,
            translations: {
              create: feature.translations.map(
                (translation) => ({
                  id: translation.id,
                  locale: translation.locale,
                  title: translation.title,
                  description: translation.description,
                  created_at: translation.createdAt,
                  updated_at: translation.updatedAt,
                }),
              ),
            },
          })),
        },
        prices: {
          create: prices.map((price) => ({
            id: price.id,
            amount_minor: price.amountMinor,
            currency_code: price.currencyCode,
            is_active: price.active,
            created_at: price.createdAt,
          })),
        },
      },
      update: {
        code: record.code,
        billing_interval: record.billingInterval,
        billing_interval_count: record.billingIntervalCount,
        trial_days: record.trialDays,
        is_public: record.isPublic,
        updated_at: record.updatedAt,
        translations: {
          deleteMany: {},
          create: translations.map((translation) => ({
            id: translation.id,
            locale: translation.locale,
            name: translation.name,
            description: translation.description,
            created_at: translation.createdAt,
            updated_at: translation.updatedAt,
          })),
        },
        features: {
          deleteMany: {},
          create: features.map((feature) => ({
            id: feature.record.id,
            code: feature.record.code,
            value: feature.record.value,
            sort_order: feature.record.sortOrder,
            is_active: feature.record.active,
            created_at: feature.record.createdAt,
            updated_at: feature.record.updatedAt,
            translations: {
              create: feature.translations.map(
                (translation) => ({
                  id: translation.id,
                  locale: translation.locale,
                  title: translation.title,
                  description: translation.description,
                  created_at: translation.createdAt,
                  updated_at: translation.updatedAt,
                }),
              ),
            },
          })),
        },
        prices: {
          deleteMany: {},
          create: prices.map((price) => ({
            id: price.id,
            amount_minor: price.amountMinor,
            currency_code: price.currencyCode,
            is_active: price.active,
            created_at: price.createdAt,
          })),
        },
      },
      include: {
        translations: {
          orderBy: {
            locale: 'asc',
          },
        },
        features: {
          orderBy: [
            {
              sort_order: 'asc',
            },
            {
              code: 'asc',
            },
          ],
          include: {
            translations: {
              orderBy: {
                locale: 'asc',
              },
            },
          },
        },
        prices: {
          orderBy: [
            {
              is_active: 'desc',
            },
            {
              currency_code: 'asc',
            },
            {
              created_at: 'desc',
            },
          ],
        },
      },
    });

    return SubscriptionPlan.hydrate({
      id: row.id,
      code: row.code,
      billingInterval: row.billing_interval,
      billingIntervalCount: row.billing_interval_count,
      trialDays: row.trial_days ?? undefined,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
      .withTranslations(
        (row.translations ?? []).map((translation) =>
          SubscriptionPlanTranslation.hydrate({
            id: translation.id,
            subscriptionPlanId: translation.subscription_plan_id,
            locale: translation.locale,
            name: translation.name,
            description: translation.description ?? undefined,
            createdAt: translation.created_at,
            updatedAt: translation.updated_at,
          }),
        ),
      )
      .withFeatures(
        row.features.map((feature) =>
          SubscriptionPlanFeature.hydrate({
            id: feature.id,
            subscriptionPlanId: feature.subscription_plan_id,
            code: feature.code,
            value: feature.value ?? undefined,
            sortOrder: feature.sort_order,
            active: feature.is_active,
            createdAt: feature.created_at,
            updatedAt: feature.updated_at,
          }).withTranslations(
            (feature.translations ?? []).map((translation) =>
              SubscriptionPlanFeatureTranslation.hydrate({
                id: translation.id,
                subscriptionPlanFeatureId:
                  translation.subscription_plan_feature_id,
                locale: translation.locale,
                title: translation.title,
                description:
                  translation.description ?? undefined,
                createdAt: translation.created_at,
                updatedAt: translation.updated_at,
              }),
            ),
          ),
        ),
      )
      .withPrices(
        row.prices.map((price) =>
          SubscriptionPrice.hydrate({
            id: price.id,
            subscriptionPlanId: price.subscription_plan_id,
            amountMinor: price.amount_minor,
            currencyCode: price.currency_code,
            active: price.is_active,
            createdAt: price.created_at,
          }),
        ),
      );
  }
}
