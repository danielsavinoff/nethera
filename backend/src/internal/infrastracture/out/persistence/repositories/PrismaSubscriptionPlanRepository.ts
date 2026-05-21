import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { SubscriptionPlanNotFoundException } from '../../../../application/exceptions/SubscriptionPlanNotFoundException.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  LoadSubscriptionPlanQuery,
  LoadSubscriptionPlansQuery,
  SubscriptionPlanRepository,
} from '../../../../application/ports/SubscriptionPlanRepository.js';
import { SubscriptionPlan } from '../../../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanFeature } from '../../../../domain/subscription/SubscriptionPlanFeature.js';
import { SubscriptionPlanFeatureTranslation } from '../../../../domain/subscription/SubscriptionPlanFeatureTranslation.js';
import { SubscriptionPlanTranslation } from '../../../../domain/subscription/SubscriptionPlanTranslation.js';
import { SubscriptionPrice } from '../../../../domain/subscription/SubscriptionPrice.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

const subscriptionPlanInclude = {
  translations: {
    orderBy: {
      language: 'asc',
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
          language: 'asc',
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
        country_code: 'asc',
      },
      {
        created_at: 'desc',
      },
    ],
  },
} satisfies Prisma.SubscriptionPlanInclude;

type SubscriptionPlanRow = Prisma.SubscriptionPlanGetPayload<{
  include: typeof subscriptionPlanInclude;
}>;

@Injectable()
export class PrismaSubscriptionPlanRepository implements SubscriptionPlanRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadSubscriptionPlanQuery,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan | null> {
    const client = this.getClient(transactionContext);

    const row = await client.subscriptionPlan.findUnique({
      where:
        'id' in query.filters
          ? { id: query.filters.id }
          : { code: query.filters.code },
      include: subscriptionPlanInclude,
    });

    return row ? this.hydrate(row) : null;
  }

  async loadMany(
    query: LoadSubscriptionPlansQuery,
    transactionContext?: TransactionContext,
  ): Promise<SubscriptionPlan[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.subscriptionPlan.findMany({
      where: {
        ...(typeof query.filters?.active === 'boolean'
          ? {
              is_active: query.filters.active,
            }
          : {}),
      },
      orderBy: [{ code: 'asc' }, { id: 'asc' }],
      include: subscriptionPlanInclude,
    });

    return rows.map((row) => this.hydrate(row));
  }

  async loadOrThrow(
    query: LoadSubscriptionPlanQuery,
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
        is_active: record.active,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
        translations: {
          create: translations.map((translation) => ({
            id: translation.id,
            language: translation.language,
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
                  language: translation.language,
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
            currency: price.currency,
            country_code: price.countryCode,
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
        is_active: record.active,
        updated_at: record.updatedAt,
        translations: {
          deleteMany: {},
          create: translations.map((translation) => ({
            id: translation.id,
            language: translation.language,
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
                  language: translation.language,
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
            currency: price.currency,
            country_code: price.countryCode,
            is_active: price.active,
            created_at: price.createdAt,
          })),
        },
      },
      include: subscriptionPlanInclude,
    });

    return this.hydrate(row);
  }

  private hydrate(row: SubscriptionPlanRow): SubscriptionPlan {
    return SubscriptionPlan.hydrate({
      id: row.id,
      code: row.code,
      billingInterval: row.billing_interval,
      billingIntervalCount: row.billing_interval_count,
      trialDays: row.trial_days ?? undefined,
      active: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
      .withTranslations(
        row.translations.map((translation) =>
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
            feature.translations.map((translation) =>
              SubscriptionPlanFeatureTranslation.hydrate({
                id: translation.id,
                subscriptionPlanFeatureId:
                  translation.subscription_plan_feature_id,
                language: translation.language,
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
            currency: price.currency,
            countryCode: price.country_code,
            active: price.is_active,
            createdAt: price.created_at,
          }),
        ),
      );
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
