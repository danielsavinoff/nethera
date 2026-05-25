import { Permission } from '../../domain/authorization/Permission.js';
import { Subscription } from '../../domain/subscription/Subscription.js';
import { SubscriptionPolicy } from '../../domain/subscription/SubscriptionPolicy.js';
import { SubscriptionStatus } from '../../domain/subscription/SubscriptionStatus.js';
import { FilterOperator } from '../models/Filter.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { TransactionRunner } from '../ports/TransactionRunner.js';
import type { UserRepository } from '../ports/UserRepository.js';
import type { VpnSubscriptionProvider } from '../ports/VpnSubscriptionProvider.js';
import type { VpnSubscriptionRepository } from '../ports/VpnSubscriptionRepository.js';

export interface CancelSubscriptionCommand {
  initiatorUserId: string;
}

export interface CancelSubscriptionResult {
  data: {
    subscription: Subscription;
  };
}

export class CancelSubscriptionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly vpnSubscriptionRepository: VpnSubscriptionRepository,
    private readonly vpnSubscriptionProvider: VpnSubscriptionProvider,
    private readonly subscriptionPolicy: SubscriptionPolicy,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: CancelSubscriptionCommand,
  ): Promise<CancelSubscriptionResult> {
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
          and: [
            {
              field: 'userId',
              operator: FilterOperator.Equals,
              value: initiator.id,
            },
            {
              field: 'status',
              operator: FilterOperator.Equals,
              value: SubscriptionStatus.Active,
            },
          ],
        },
      });

    this.subscriptionPolicy.assertCanCancel(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: subscription.userId,
      },
    );

    const vpnSubscription =
      await this.vpnSubscriptionRepository.load({
        filter: {
          field: 'userId',
          operator: FilterOperator.Equals,
          value: subscription.userId,
        },
      });

    if (vpnSubscription) {
      await this.vpnSubscriptionProvider.expireByExternalId(
        vpnSubscription.externalId,
      );
    }

    const canceledSubscription = subscription.cancel();

    await this.transactionRunner.run(
      async (transactionContext) => {
        await this.subscriptionRepository.save(
          canceledSubscription,
          transactionContext,
        );
      },
    );

    return {
      data: {
        subscription: canceledSubscription,
      },
    };
  }
}
