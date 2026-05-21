import { Injectable } from '@nestjs/common';
import { CreateInvoiceResult } from '../../../../application/usecases/CreateInvoiceUseCase.js';
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
      amountDueMinor: invoice.amountDueMinor,
      currency: invoice.currency,
      externalCheckoutUrl: invoice.externalCheckoutUrl,
      expiresAt: invoice.expiresAt,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
}
