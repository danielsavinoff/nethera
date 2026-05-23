import { Injectable } from '@nestjs/common';
import { CreateInvoiceResult } from '../../../../application/usecases/CreateInvoiceUseCase.js';
import { MoneyFormatter } from '../../../../domain/money/MoneyFormatter.js';
import { Invoice } from '../../../../domain/subscription/Invoice.js';
import { GetInvoiceAmountResponseDto } from '../dtos/GetInvoiceAmountResponseDto.js';
import { GetInvoiceResponseDto } from '../dtos/GetInvoiceResponseDto.js';

@Injectable()
export class CreateInvoicePresenter {
  present(result: CreateInvoiceResult): GetInvoiceResponseDto {
    const invoice = result.data.invoice;

    return new GetInvoiceResponseDto({
      id: invoice.id,
      externalId: invoice.externalId,
      provider: invoice.provider,
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
