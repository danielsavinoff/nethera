import { Permission } from '../../domain/authorization/Permission.js';
import { InvoiceLine } from '../../domain/subscription/InvoiceLine.js';
import { InvoicePolicy } from '../../domain/subscription/InvoicePolicy.js';
import { FilterOperator } from '../models/Filter.js';
import type { InvoiceRepository } from '../ports/InvoiceRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetInvoiceLinesCommand {
  initiatorUserId: string;
  invoiceId: string;
  locale: string;
}

export interface GetInvoiceLinesResult {
  data: {
    lines: InvoiceLine[];
    currencyCode: string;
    locale: string;
  };
}

export class GetInvoiceLinesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoicePolicy: InvoicePolicy,
  ) {}

  async execute(
    command: GetInvoiceLinesCommand,
  ): Promise<GetInvoiceLinesResult> {
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
      with: {
        lines: true,
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
        lines: invoice.lines,
        currencyCode: invoice.currencyCode,
        locale: command.locale,
      },
    };
  }
}
