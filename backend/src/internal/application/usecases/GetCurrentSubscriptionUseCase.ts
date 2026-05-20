import { Permission } from '../../domain/authorization/Permission.js';
import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionPolicy } from '../../domain/subscription/SubscriptionPolicy.js';
import { SubscriptionStatus } from '../../domain/subscription/SubscriptionStatus.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetCurrentSubscriptionCommand {
  initiatorUserId: string;
  language: string;
}

export interface GetCurrentSubscriptionResult {
  data: {
    subscription: Subscription;
  };
}

export class GetCurrentSubscriptionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionPolicy: SubscriptionPolicy,
  ) {}

  async execute(
    command: GetCurrentSubscriptionCommand,
  ): Promise<GetCurrentSubscriptionResult> {
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

    this.subscriptionPolicy.assertCanView(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: initiator.id,
      },
    );

    const subscription =
      await this.subscriptionRepository.loadOrThrow({
        filters: {
          userId: initiator.id,
          status: SubscriptionStatus.Active,
        },
        with: {
          plan: {
            translationLanguage: command.language,
          },
        },
      });

    return {
      data: {
        subscription,
      },
    };
  }
}
