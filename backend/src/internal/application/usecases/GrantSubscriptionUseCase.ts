import { VpnSubscription } from '../../domain/subscription/VpnSubscription.js';
import { SubscriptionPlanNotLoadedException } from '../exceptions/SubscriptionPlanNotLoadedException.js';
import { FilterOperator } from '../models/Filter.js';
import type { IdGenerator } from '../ports/IdGenerator.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { TransactionRunner } from '../ports/TransactionRunner.js';
import type { VpnSubscriptionProvider } from '../ports/VpnSubscriptionProvider.js';
import type { VpnSubscriptionRepository } from '../ports/VpnSubscriptionRepository.js';
import { Duration } from '../../domain/time/Duration.js';

export interface GrantSubscriptionCommand {
  subscriptionId: string;
}

export type GrantSubscriptionResult = void;

export class GrantSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly vpnSubscriptionProvider: VpnSubscriptionProvider,
    private readonly vpnSubscriptionRepository: VpnSubscriptionRepository,
    private readonly idGenerator: IdGenerator,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: GrantSubscriptionCommand,
  ): Promise<GrantSubscriptionResult> {
    const subscription =
      await this.subscriptionRepository.loadOrThrow({
        filter: {
          field: 'id',
          operator: FilterOperator.Equals,
          value: command.subscriptionId,
        },
        with: {
          subscriptionPlans: true,
        },
      });

    if (!subscription.isPlanLoaded()) {
      throw new SubscriptionPlanNotLoadedException();
    }

    const subscriptionPlan = subscription.getPlan();

    if (!subscriptionPlan) {
      throw new SubscriptionPlanNotLoadedException();
    }

    const period = Duration.interval(
      subscriptionPlan.billingInterval,
      subscriptionPlan.billingIntervalCount,
    );

    const renewedSubscription = subscription.renew(period);

    let vpnSubscription =
      await this.vpnSubscriptionRepository.load({
        filter: {
          field: 'userId',
          operator: FilterOperator.Equals,
          value: subscription.userId,
        },
      });

    if (!vpnSubscription) {
      const vpnSubscriptionId = this.idGenerator.generate();

      const externalVpnSubscription =
        await this.vpnSubscriptionProvider.create({
          userName: vpnSubscriptionId,
          expiresAt: renewedSubscription.expiresAt,
        });

      vpnSubscription = VpnSubscription.create({
        id: vpnSubscriptionId,
        userId: subscription.userId,
        externalId: externalVpnSubscription.externalId,
        provider: externalVpnSubscription.provider,
        subscriptionUrl: externalVpnSubscription.subscriptionUrl,
      });
    } else {
      // TODO: Extend in VPN provider
    }

    await this.transactionRunner.run(
      async (transactionContext) => {
        await this.subscriptionRepository.save(
          renewedSubscription,
          transactionContext,
        );

        await this.vpnSubscriptionRepository.save(
          vpnSubscription,
          transactionContext,
        );
      },
    );
  }
}
