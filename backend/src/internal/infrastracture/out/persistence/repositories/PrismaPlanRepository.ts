import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PlanNotFoundException } from '../../../../application/exceptions/PlanNotFoundException.js';
import type {
  LoadPlanQuery,
  LoadPlansQuery,
  PlanRepository,
} from '../../../../application/ports/PlanRepository.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import { Plan } from '../../../../domain/subscription/Plan.js';
import { PlanFeature } from '../../../../domain/subscription/PlanFeature.js';
import { PlanFeatureTranslation } from '../../../../domain/subscription/PlanFeatureTranslation.js';
import { PlanTranslation } from '../../../../domain/subscription/PlanTranslation.js';
import { PrismaTransactionContext } from '../transaction/PrismaTransactionContext.js';

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(
    query: LoadPlanQuery,
    transactionContext?: TransactionContext,
  ): Promise<Plan | null> {
    const client = this.getClient(transactionContext);

    const row = await client.plan.findUnique({
      where:
        'id' in query.filters
          ? { id: query.filters.id }
          : { code: query.filters.code },
      include: {
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
      },
    });

    if (!row) {
      return null;
    }

    return Plan.hydrate({
      id: row.id,
      code: row.code,
      priceAmount: row.price_amount.toString(),
      priceCurrency: row.price_currency,
      billingInterval: row.billing_interval,
      billingIntervalCount: row.billing_interval_count,
      trialDays: row.trial_days ?? undefined,
      active: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
      .withTranslations(
        row.translations.map((translation) =>
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
      )
      .withFeatures(
        row.features.map((feature) =>
          PlanFeature.hydrate({
            id: feature.id,
            planId: feature.plan_id,
            code: feature.code,
            value: feature.value ?? undefined,
            sortOrder: feature.sort_order,
            active: feature.is_active,
            createdAt: feature.created_at,
            updatedAt: feature.updated_at,
          }).withTranslations(
            feature.translations.map((translation) =>
              PlanFeatureTranslation.hydrate({
                id: translation.id,
                planFeatureId: translation.plan_feature_id,
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
      );
  }

  async loadMany(
    query: LoadPlansQuery,
    transactionContext?: TransactionContext,
  ): Promise<Plan[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.plan.findMany({
      where: {
        ...(typeof query.filters?.active === 'boolean'
          ? {
              is_active: query.filters.active,
            }
          : {}),
      },
      orderBy: [{ code: 'asc' }, { id: 'asc' }],
      include: {
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
      },
    });

    return rows.map((row) =>
      Plan.hydrate({
        id: row.id,
        code: row.code,
        priceAmount: row.price_amount.toString(),
        priceCurrency: row.price_currency,
        billingInterval: row.billing_interval,
        billingIntervalCount: row.billing_interval_count,
        trialDays: row.trial_days ?? undefined,
        active: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })
        .withTranslations(
          row.translations.map((translation) =>
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
        )
        .withFeatures(
          row.features.map((feature) =>
            PlanFeature.hydrate({
              id: feature.id,
              planId: feature.plan_id,
              code: feature.code,
              value: feature.value ?? undefined,
              sortOrder: feature.sort_order,
              active: feature.is_active,
              createdAt: feature.created_at,
              updatedAt: feature.updated_at,
            }).withTranslations(
              feature.translations.map((translation) =>
                PlanFeatureTranslation.hydrate({
                  id: translation.id,
                  planFeatureId: translation.plan_feature_id,
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
        ),
    );
  }

  async loadOrThrow(
    query: LoadPlanQuery,
    transactionContext?: TransactionContext,
  ): Promise<Plan> {
    const plan = await this.load(query, transactionContext);

    if (!plan) {
      throw new PlanNotFoundException();
    }

    return plan;
  }

  async save(
    plan: Plan,
    transactionContext?: TransactionContext,
  ): Promise<Plan> {
    const client = this.getClient(transactionContext);
    const record = plan.toRecord();
    const translations = plan
      .getAllTranslations()
      .map((translation) => translation.toRecord());
    const features = plan.getAllFeatures().map((feature) => ({
      record: feature.toRecord(),
      translations: feature
        .getAllTranslations()
        .map((translation) => translation.toRecord()),
    }));

    const row = await client.plan.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        code: record.code,
        price_amount: record.priceAmount,
        price_currency: record.priceCurrency,
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
      },
      update: {
        code: record.code,
        price_amount: record.priceAmount,
        price_currency: record.priceCurrency,
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
      },
      include: {
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
      },
    });

    return Plan.hydrate({
      id: row.id,
      code: row.code,
      priceAmount: row.price_amount.toString(),
      priceCurrency: row.price_currency,
      billingInterval: row.billing_interval,
      billingIntervalCount: row.billing_interval_count,
      trialDays: row.trial_days ?? undefined,
      active: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
      .withTranslations(
        row.translations.map((translation) =>
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
      )
      .withFeatures(
        row.features.map((feature) =>
          PlanFeature.hydrate({
            id: feature.id,
            planId: feature.plan_id,
            code: feature.code,
            value: feature.value ?? undefined,
            sortOrder: feature.sort_order,
            active: feature.is_active,
            createdAt: feature.created_at,
            updatedAt: feature.updated_at,
          }).withTranslations(
            feature.translations.map((translation) =>
              PlanFeatureTranslation.hydrate({
                id: translation.id,
                planFeatureId: translation.plan_feature_id,
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
      );
  }

  private getClient(transactionContext?: TransactionContext) {
    if (transactionContext instanceof PrismaTransactionContext) {
      return transactionContext.client;
    }

    return this.prisma;
  }
}
