import { Permission } from '../../domain/authorization/Permission.js';
import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionPolicy } from '../../domain/subscription/SubscriptionPolicy.js';
import { FilterOperator } from '../models/Filter.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetSubscriptionCommand {
  initiatorUserId: string;
  subscriptionId: string;
  language: string;
}

export interface GetSubscriptionResult {
  data: {
    subscription: Subscription;
  };
}

export class GetSubscriptionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionPolicy: SubscriptionPolicy,
  ) {}

  async execute(
    command: GetSubscriptionCommand,
  ): Promise<GetSubscriptionResult> {
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

    const subscription =
      await this.subscriptionRepository.loadOrThrow({
        filter: {
          field: 'id',
          operator: FilterOperator.Equals,
          value: command.subscriptionId,
        },
        with: {
          subscriptionPlans: {
            with: {
              subscriptionPlanTranslations: {
                filter: {
                  field: 'language',
                  operator: FilterOperator.Equals,
                  value: command.language,
                },
              },
            },
          },
        },
      });

    this.subscriptionPolicy.assertCanView(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: subscription.userId,
      },
    );

    return {
      data: {
        subscription,
      },
    };
  }
}
