import { BillingProvider } from '../../domain/subscription/BillingProvider.js';
import { Invoice } from '../../domain/subscription/Invoice.js';
import { InvoiceLineType } from '../../domain/subscription/InvoiceLineType.js';
import { Permission } from '../../domain/authorization/Permission.js';
import { SubscriptionStatus } from '../../domain/subscription/SubscriptionStatus.js';
import { FilterOperator } from '../models/Filter.js';
import type { SubscriptionRepository } from '../ports/SubscriptionRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';
import { CreateInvoiceUseCase } from './CreateInvoiceUseCase.js';

export interface ExtendSubscriptionCommand {
  initiatorUserId: string;
  provider: BillingProvider;
  locale: string;
}

export interface ExtendSubscriptionResult {
  data: {
    invoice: Invoice;
    locale: string;
  };
}

export class ExtendSubscriptionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
  ) {}

  async execute(
    command: ExtendSubscriptionCommand,
  ): Promise<ExtendSubscriptionResult> {
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

    return this.createInvoiceUseCase.execute({
      initiatorUserId: initiator.id,
      type: InvoiceLineType.SubscriptionPlan,
      referenceId: subscription.subscriptionPlanId,
      provider: command.provider,
      locale: command.locale,
    });
  }
}
