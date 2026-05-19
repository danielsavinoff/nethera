import { Permission } from '../../domain/authorization/Permission.js';
import { SubscriptionInvoice } from '../../domain/subscription/SubscriptionInvoice.js';
import { SubscriptionInvoicePolicy } from '../../domain/subscription/SubscriptionInvoicePolicy.js';
import type { SubscriptionInvoiceRepository } from '../ports/SubscriptionInvoiceRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetSubscriptionInvoicesCommand {
  initiatorUserId: string;
}

export interface GetSubscriptionInvoicesResult {
  data: {
    invoices: SubscriptionInvoice[];
  };
}

export class GetSubscriptionInvoicesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionInvoiceRepository: SubscriptionInvoiceRepository,
    private readonly subscriptionInvoicePolicy: SubscriptionInvoicePolicy,
  ) {}

  async execute(
    command: GetSubscriptionInvoicesCommand,
  ): Promise<GetSubscriptionInvoicesResult> {
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

    this.subscriptionInvoicePolicy.assertCanView(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: initiator.id,
      },
    );

    const invoices =
      await this.subscriptionInvoiceRepository.loadMany({
        filters: {
          userId: initiator.id,
        },
      });

    return {
      data: {
        invoices,
      },
    };
  }
}
