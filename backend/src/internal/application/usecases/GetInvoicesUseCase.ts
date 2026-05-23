import { Invoice } from '../../domain/subscription/Invoice.js';
import { FilterOperator } from '../models/Filter.js';
import type { InvoiceRepository } from '../ports/InvoiceRepository.js';
import type { UserRepository } from '../ports/UserRepository.js';

export interface GetInvoicesCommand {
  initiatorUserId: string;
  locale: string;
}

export interface GetInvoicesResult {
  data: {
    invoices: Invoice[];
    locale: string;
  };
}

export class GetInvoicesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(
    command: GetInvoicesCommand,
  ): Promise<GetInvoicesResult> {
    const initiator = await this.userRepository.loadOrThrow({
      filters: {
        id: command.initiatorUserId,
      },
    });

    const invoices = await this.invoiceRepository.loadMany({
      filter: {
        field: 'userId',
        operator: FilterOperator.Equals,
        value: initiator.id,
      },
    });

    return {
      data: {
        invoices,
        locale: command.locale,
      },
    };
  }
}
