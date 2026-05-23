import { Permission } from '../../domain/authorization/Permission.js';
import { VpnSubscriptionPolicy } from '../../domain/subscription/VpnSubscriptionPolicy.js';
import { FilterOperator } from '../models/Filter.js';
import type { UserRepository } from '../ports/UserRepository.js';
import type { VpnSubscriptionRepository } from '../ports/VpnSubscriptionRepository.js';
import type { VpnUsageProvider } from '../ports/VpnUsageProvider.js';

export interface GetCurrentVpnSubscriptionUsageCommand {
  initiatorUserId: string;
}

export interface GetCurrentVpnSubscriptionUsageResult {
  data: {
    usageBytes: Record<string, number>;
  };
}

export class GetCurrentVpnSubscriptionUsageUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly vpnSubscriptionRepository: VpnSubscriptionRepository,
    private readonly vpnUsageProvider: VpnUsageProvider,
    private readonly vpnSubscriptionPolicy: VpnSubscriptionPolicy,
  ) {}

  async execute(
    command: GetCurrentVpnSubscriptionUsageCommand,
  ): Promise<GetCurrentVpnSubscriptionUsageResult> {
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

    const { startDate, endDate } = this.getCurrentMonthRange();

    const externalVpnUsage = await this.vpnUsageProvider.fetch({
      filter: {
        and: [
          {
            field: 'externalId',
            operator: FilterOperator.Equals,
            value: vpnSubscription.externalId,
          },
          {
            field: 'startDate',
            operator: FilterOperator.Equals,
            value: startDate,
          },
          {
            field: 'endDate',
            operator: FilterOperator.Equals,
            value: endDate,
          },
        ],
      },
    });

    return {
      data: {
        usageBytes: this.fillMissingDays(
          startDate,
          endDate,
          externalVpnUsage.usageBytes,
        ),
      },
    };
  }

  private getCurrentMonthRange(): {
    startDate: Date;
    endDate: Date;
  } {
    const now = new Date();

    return {
      startDate: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      ),
      endDate: new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
        ),
      ),
    };
  }

  private fillMissingDays(
    startDate: Date,
    endDate: Date,
    usageBytes: Record<string, number>,
  ): Record<string, number> {
    const result: Record<string, number> = {};

    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const date = cursor.toISOString().slice(0, 10);

      result[date] = usageBytes[date] ?? 0;

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return result;
  }
}
