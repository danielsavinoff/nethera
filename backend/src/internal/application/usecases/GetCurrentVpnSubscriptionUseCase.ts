import { Permission } from '../../domain/authorization/Permission.js';
import { VpnSubscription } from '../../domain/subscription/VpnSubscription.js';
import { VpnSubscriptionPolicy } from '../../domain/subscription/VpnSubscriptionPolicy.js';
import { FilterOperator } from '../models/Filter.js';
import type { UserRepository } from '../ports/UserRepository.js';
import type { VpnSubscriptionRepository } from '../ports/VpnSubscriptionRepository.js';

export interface GetCurrentVpnSubscriptionCommand {
  initiatorUserId: string;
}

export interface GetCurrentVpnSubscriptionResult {
  data: {
    vpnSubscription: VpnSubscription;
  };
}

export class GetCurrentVpnSubscriptionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly vpnSubscriptionRepository: VpnSubscriptionRepository,
    private readonly vpnSubscriptionPolicy: VpnSubscriptionPolicy,
  ) {}

  async execute(
    command: GetCurrentVpnSubscriptionCommand,
  ): Promise<GetCurrentVpnSubscriptionResult> {
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

    const vpnSubscription =
      await this.vpnSubscriptionRepository.loadOrThrow({
        filter: {
          field: 'userId',
          operator: FilterOperator.Equals,
          value: initiator.id,
        },
      });

    this.vpnSubscriptionPolicy.assertCanView(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: vpnSubscription.userId,
      },
    );

    return {
      data: {
        vpnSubscription,
      },
    };
  }
}
