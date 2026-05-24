import { Permission } from '../../domain/authorization/Permission.js';
import { SubscriptionPlan } from '../../domain/subscription/SubscriptionPlan.js';
import type { SubscriptionPlanRecord } from '../../domain/subscription/SubscriptionPlanRecord.js';
import { SubscriptionPlanPolicy } from '../../domain/subscription/SubscriptionPlanPolicy.js';
import { Interval } from '../../domain/time/Interval.js';
import { Filter, FilterOperator } from '../models/Filter.js';
import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetSubscriptionPlansCommand {
  initiatorUserId: string;
  locale: string;
  onlyPublic?: boolean;
  billingInterval?: Interval;
  billingIntervalCount?: number;
}

export interface GetSubscriptionPlansResult {
  data: {
    locale: string;
    subscriptionPlans: SubscriptionPlan[];
  };
}

export class GetSubscriptionPlansUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly subscriptionPlanPolicy: SubscriptionPlanPolicy,
  ) {}

  async execute(
    command: GetSubscriptionPlansCommand,
  ): Promise<GetSubscriptionPlansResult> {
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

    const onlyPublic = command.onlyPublic ?? false;

    this.subscriptionPlanPolicy.assertCanView(
      {
        permissions: initiatorPermissions,
      },
      {
        onlyPublic: command.onlyPublic ?? false,
      },
    );

    const filters: Filter<SubscriptionPlanRecord>[] = [];

    if (onlyPublic) {
      filters.push({
        field: 'isPublic',
        operator: FilterOperator.Equals,
        value: true,
      });
    }

    if (command.billingInterval) {
      filters.push({
        field: 'billingInterval',
        operator: FilterOperator.Equals,
        value: command.billingInterval,
      });
    }

    if (typeof command.billingIntervalCount !== 'undefined') {
      filters.push({
        field: 'billingIntervalCount',
        operator: FilterOperator.Equals,
        value: command.billingIntervalCount,
      });
    }

    const subscriptionPlans =
      await this.subscriptionPlanRepository.loadMany({
        filter:
          filters.length > 0
            ? {
                and: filters,
              }
            : undefined,
        with: {
          subscriptionPlanTranslations: {
            filter: {
              field: 'locale',
              operator: FilterOperator.Equals,
              value: command.locale,
            },
          },
          subscriptionPlanFeatures: {
            filter: {
              field: 'active',
              operator: FilterOperator.Equals,
              value: true,
            },
            with: {
              subscriptionPlanFeatureTranslations: {
                filter: {
                  field: 'locale',
                  operator: FilterOperator.Equals,
                  value: command.locale,
                },
              },
            },
          },
          subscriptionPrices: {
            filter: {
              and: [
                {
                  field: 'active',
                  operator: FilterOperator.Equals,
                  value: true,
                },
                {
                  field: 'locale',
                  operator: FilterOperator.Equals,
                  value: command.locale,
                },
              ],
            },
          },
        },
      });

    return {
      data: {
        locale: command.locale,
        subscriptionPlans,
      },
    };
  }
}
