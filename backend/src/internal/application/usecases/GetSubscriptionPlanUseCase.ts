import { Permission } from '../../domain/authorization/Permission.js';
import { SubscriptionPlan } from '../../domain/subscription/SubscriptionPlan.js';
import { SubscriptionPlanPolicy } from '../../domain/subscription/SubscriptionPlanPolicy.js';
import { SupportedCurrency } from '../../domain/money/SupportedCurrency.js';
import { FilterOperator } from '../models/Filter.js';
import type { SubscriptionPlanRepository } from '../ports/SubscriptionPlanRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetSubscriptionPlanCommand {
  initiatorUserId: string;
  subscriptionPlanId: string;
  locale: string;
}

export interface GetSubscriptionPlanResult {
  data: {
    locale: string;
    currencyCode: string;
    subscriptionPlan: SubscriptionPlan;
  };
}

export class GetSubscriptionPlanUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly subscriptionPlanPolicy: SubscriptionPlanPolicy,
  ) {}

  async execute(
    command: GetSubscriptionPlanCommand,
  ): Promise<GetSubscriptionPlanResult> {
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

    const locale = initiator.locale ?? command.locale;

    const currencyCode =
      initiator.preferredCurrencyCode ?? SupportedCurrency.USD;

    this.subscriptionPlanPolicy.assertCanView(
      {
        permissions: initiatorPermissions,
      },
      {
        onlyPublic: false,
      },
    );

    const subscriptionPlan =
      await this.subscriptionPlanRepository.loadOrThrow({
        filter: {
          field: 'id',
          operator: FilterOperator.Equals,
          value: command.subscriptionPlanId,
        },
        with: {
          subscriptionPlanTranslations: {
            filter: {
              field: 'locale',
              operator: FilterOperator.Equals,
              value: locale,
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
                  value: locale,
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
                  field: 'currencyCode',
                  operator: FilterOperator.Equals,
                  value: currencyCode,
                },
              ],
            },
          },
        },
      });

    return {
      data: {
        locale,
        currencyCode,
        subscriptionPlan,
      },
    };
  }
}
