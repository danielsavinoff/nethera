import type { PlanRepository } from '../ports/PlanRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';
import { Permission } from '../../domain/authorization/Permission.js';
import { BillingInterval } from '../../domain/subscription/BillingInterval.js';
import { Plan } from '../../domain/subscription/Plan.js';
import { PlanFeature } from '../../domain/subscription/PlanFeature.js';
import { PlanFeatureTranslation } from '../../domain/subscription/PlanFeatureTranslation.js';
import { PlanPolicy } from '../../domain/subscription/PlanPolicy.js';
import { PlanTranslation } from '../../domain/subscription/PlanTranslation.js';

export interface CreatePlanCommandFeatureTranslation {
  language: string;
  title: string;
  description?: string;
}

export interface CreatePlanCommandFeature {
  code: string;
  value?: string;
  sortOrder?: number;
  active?: boolean;
  translations?: CreatePlanCommandFeatureTranslation[];
}

export interface CreatePlanCommandTranslation {
  language: string;
  name: string;
  description?: string;
}

export interface CreatePlanCommand {
  initiatorUserId: string;
  code: string;
  priceAmount: string;
  priceCurrency: string;
  billingInterval: BillingInterval;
  billingIntervalCount?: number;
  trialDays?: number;
  active?: boolean;
  translations?: CreatePlanCommandTranslation[];
  features?: CreatePlanCommandFeature[];
}

export interface CreatePlanResult {
  data: {
    plan: Plan;
  };
}

export class CreatePlanUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly planRepository: PlanRepository,
    private readonly planPolicy: PlanPolicy,
  ) {}

  async execute(
    command: CreatePlanCommand,
  ): Promise<CreatePlanResult> {
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

    this.planPolicy.assertCanCreate(
      {
        permissions: initiatorPermissions,
      },
      undefined,
    );

    const plan = Plan.create({
      code: command.code,
      priceAmount: command.priceAmount,
      priceCurrency: command.priceCurrency,
      billingInterval: command.billingInterval,
      billingIntervalCount: command.billingIntervalCount,
      trialDays: command.trialDays,
      active: command.active,
    });

    const translations =
      command.translations?.map((translation) =>
        PlanTranslation.create({
          planId: plan.id,
          language: translation.language,
          name: translation.name,
          description: translation.description,
        }),
      ) ?? [];

    const features =
      command.features?.map((feature) => {
        const planFeature = PlanFeature.create({
          planId: plan.id,
          code: feature.code,
          value: feature.value,
          sortOrder: feature.sortOrder,
          active: feature.active,
        });

        const translations =
          feature.translations?.map((translation) =>
            PlanFeatureTranslation.create({
              planFeatureId: planFeature.id,
              language: translation.language,
              title: translation.title,
              description: translation.description,
            }),
          ) ?? [];

        return planFeature.withTranslations(translations);
      }) ?? [];

    const savedPlan = await this.planRepository.save(
      plan.withTranslations(translations).withFeatures(features),
    );

    return {
      data: {
        plan: savedPlan,
      },
    };
  }
}
