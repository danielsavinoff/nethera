import { Injectable } from '@nestjs/common';
import { GetInvoicesResult } from '../../../../application/usecases/GetInvoicesUseCase.js';
import { MoneyFormatter } from '../../../../domain/money/MoneyFormatter.js';
import { Invoice } from '../../../../domain/subscription/Invoice.js';
import { GetInvoiceAmountResponseDto } from '../dtos/GetInvoiceAmountResponseDto.js';
import { GetInvoiceResponseDto } from '../dtos/GetInvoiceResponseDto.js';
import { GetInvoicesResponseDto } from '../dtos/GetInvoicesResponseDto.js';

@Injectable()
export class GetInvoicesPresenter {
  present(result: GetInvoicesResult): GetInvoicesResponseDto {
    return new GetInvoicesResponseDto({
      invoices: result.data.invoices.map(
        (invoice) =>
          new GetInvoiceResponseDto({
            id: invoice.id,
            externalId: invoice.externalId,
            provider: invoice.provider,
            billingEmail: invoice.billingEmail,
            userId: invoice.userId,
            status: invoice.status,
            total: this.getAmountDto(
              invoice.totalAmountMinor,
              invoice,
              result.data.locale,
            ),
            paid: this.getAmountDto(
              invoice.amountPaidMinor,
              invoice,
              result.data.locale,
            ),
            due: this.getAmountDto(
              invoice.getAmountDueMinor(),
              invoice,
              result.data.locale,
            ),
            currency: invoice.currency,
            externalCheckoutUrl: invoice.externalCheckoutUrl,
            expiresAt: invoice.expiresAt,
            createdAt: invoice.createdAt,
          }),
      ),
    });
  }

  private getAmountDto(
    amountMinor: number,
    invoice: Invoice,
    locale: string,
  ): GetInvoiceAmountResponseDto {
    return new GetInvoiceAmountResponseDto({
      amountMinor,
      formatted: MoneyFormatter.format(
        amountMinor,
        locale,
        invoice.currency,
      ),
    });
  }
}
