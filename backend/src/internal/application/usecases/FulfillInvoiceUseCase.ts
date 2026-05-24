import { InvoiceLineType } from '../../domain/subscription/InvoiceLineType.js';
import { Invoice } from '../../domain/subscription/Invoice.js';
import type { InvoiceRepository } from '../ports/InvoiceRepository.js';
import { GrantSubscriptionUseCase } from './GrantSubscriptionUseCase.js';
import { FilterOperator } from '../models/Filter.js';

export interface FulfillInvoiceCommand {
  invoiceId: string;
}

export interface FulfillInvoiceResult {
  data: {
    invoice: Invoice;
  };
}

export class FulfillInvoiceUseCase {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly grantSubscriptionUseCase: GrantSubscriptionUseCase,
  ) {}

  async execute(
    command: FulfillInvoiceCommand,
  ): Promise<FulfillInvoiceResult> {
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

    for (const line of invoice.lines) {
      if (line.type === InvoiceLineType.SubscriptionPlan) {
        await this.grantSubscriptionUseCase.execute({
          userId: invoice.userId,
          subscriptionPlanId: line.referenceId,
        });
      }
    }

    return {
      data: {
        invoice,
      },
    };
  }
}
