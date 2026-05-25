import { Permission } from '../../domain/authorization/Permission.js';
import { Invoice } from '../../domain/subscription/Invoice.js';
import { InvoicePolicy } from '../../domain/subscription/InvoicePolicy.js';
import { FilterOperator } from '../models/Filter.js';
import type { InvoiceRepository } from '../ports/InvoiceRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetInvoiceCommand {
  initiatorUserId: string;
  invoiceId: string;
  locale: string;
}

export interface GetInvoiceResult {
  data: {
    invoice: Invoice;
    locale: string;
  };
}

export class GetInvoiceUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoicePolicy: InvoicePolicy,
  ) {}

  async execute(
    command: GetInvoiceCommand,
  ): Promise<GetInvoiceResult> {
    const initiator = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
      with: {
        roles: true,
      },
    });

    const invoice = await this.invoiceRepository.loadOrThrow({
      filter: {
        field: 'id',
        operator: FilterOperator.Equals,
        value: command.invoiceId,
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

    this.invoicePolicy.assertCanView(
      {
        userId: initiator.id,
        permissions: initiatorPermissions,
      },
      {
        userId: invoice.userId,
      },
    );

    return {
      data: {
        invoice,
        locale: command.locale,
      },
    };
  }
}
