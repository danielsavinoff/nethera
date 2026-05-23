import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';
import { Permission } from '../../domain/authorization/Permission.js';
import { Interval } from '../../domain/time/Interval.js';
import { SubscriptionPlan } from '../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanFeature } from '../../domain/subscription/SubscriptionPlanFeature.js';
import { SubscriptionPlanFeatureTranslation } from '../../domain/subscription/SubscriptionPlanFeatureTranslation.js';
import { SubscriptionPlanPolicy } from '../../domain/subscription/SubscriptionPlanPolicy.js';
import { SubscriptionPlanTranslation } from '../../domain/subscription/SubscriptionPlanTranslation.js';
import { SubscriptionPrice } from '../../domain/subscription/SubscriptionPrice.js';

export interface CreateSubscriptionPlanCommandFeatureTranslation {
  locale: string;
  title: string;
  description?: string;
}

export interface CreateSubscriptionPlanCommandFeature {
  code: string;
  value?: string;
  sortOrder?: number;
  active?: boolean;
  translations?: CreateSubscriptionPlanCommandFeatureTranslation[];
}

export interface CreateSubscriptionPlanCommandTranslation {
  locale: string;
  name: string;
  description?: string;
}

export interface CreateSubscriptionPlanCommandPrice {
  amountMinor: number;
  currency: string;
  locale: string;
  active?: boolean;
}

export interface CreateSubscriptionPlanCommand {
  initiatorUserId: string;
  code: string;
  billingInterval: Interval;
  billingIntervalCount?: number;
  trialDays?: number;
  isPublic?: boolean;
  translations?: CreateSubscriptionPlanCommandTranslation[];
  features?: CreateSubscriptionPlanCommandFeature[];
  prices?: CreateSubscriptionPlanCommandPrice[];
}

export interface CreateSubscriptionPlanResult {
  data: {
    subscriptionPlan: SubscriptionPlan;
  };
}

export class CreateSubscriptionPlanUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly subscriptionPlanPolicy: SubscriptionPlanPolicy,
  ) {}

  async execute(
    command: CreateSubscriptionPlanCommand,
  ): Promise<CreateSubscriptionPlanResult> {
    const initiator = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
      with: {
        roles: true,
      },
    });

    const initiatorPermissions = [
      ...new Set(
        (initiator.roles ?? []).flatMap((role) =>
          role
            .getAllPermissions()
            .map((permission) => permission.name),
        ),
      ),
    ] as Permission[];

    this.subscriptionPlanPolicy.assertCanCreate(
      {
        permissions: initiatorPermissions,
      },
      undefined,
    );

    const subscriptionPlan = SubscriptionPlan.create({
      code: command.code,
      billingInterval: command.billingInterval,
      billingIntervalCount: command.billingIntervalCount,
      trialDays: command.trialDays,
      isPublic: command.isPublic,
    });

    const translations =
      command.translations?.map((translation) =>
        SubscriptionPlanTranslation.create({
          subscriptionPlanId: subscriptionPlan.id,
          locale: translation.locale,
          name: translation.name,
          description: translation.description,
        }),
      ) ?? [];

    const features =
      command.features?.map((feature) => {
        const planFeature = SubscriptionPlanFeature.create({
          subscriptionPlanId: subscriptionPlan.id,
          code: feature.code,
          value: feature.value,
          sortOrder: feature.sortOrder,
          active: feature.active,
        });

        const translations =
          feature.translations?.map((translation) =>
            SubscriptionPlanFeatureTranslation.create({
              subscriptionPlanFeatureId: planFeature.id,
              locale: translation.locale,
              title: translation.title,
              description: translation.description,
            }),
          ) ?? [];

        return planFeature.withTranslations(translations);
      }) ?? [];

    const prices =
      command.prices?.map((price) =>
        SubscriptionPrice.create({
          subscriptionPlanId: subscriptionPlan.id,
          amountMinor: price.amountMinor,
          currency: price.currency,
          locale: price.locale,
          active: price.active,
        }),
      ) ?? [];

    const savedPlan = await this.subscriptionPlanRepository.save(
      subscriptionPlan
        .withTranslations(translations)
        .withFeatures(features)
        .withPrices(prices),
    );

    return {
      data: {
        subscriptionPlan: savedPlan,
      },
    };
  }
}
