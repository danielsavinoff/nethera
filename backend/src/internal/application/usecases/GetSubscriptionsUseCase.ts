import { Permission } from '../../domain/authorization/Permission.js';
import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionPolicy } from '../../domain/subscription/SubscriptionPolicy.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetSubscriptionsCommand {
  initiatorUserId: string;
  language: string;
}

export interface GetSubscriptionsResult {
  data: {
    subscriptions: Subscription[];
  };
}

export class GetSubscriptionsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionPolicy: SubscriptionPolicy,
  ) {}

  async execute(
    command: GetSubscriptionsCommand,
  ): Promise<GetSubscriptionsResult> {
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

    const canViewAny = initiatorPermissions.includes(
      Permission.SubscriptionViewAny,
    );

    if (!canViewAny) {
      this.subscriptionPolicy.assertCanView(
        {
          userId: initiator.id,
          permissions: initiatorPermissions,
        },
        {
          userId: initiator.id,
        },
      );
    }

    const subscriptions =
      await this.subscriptionRepository.loadMany({
        filters: canViewAny
          ? undefined
          : {
              userId: initiator.id,
            },
        with: {
          plan: {
            translationLanguage: command.language,
          },
        },
      });

    return {
      data: {
        subscriptions,
      },
    };
  }
}
