import { Injectable } from '@nestjs/common';
import { CreateSubscriptionInvoiceResult } from '../../../../application/usecases/CreateSubscriptionInvoiceUseCase.js';
import { GetSubscriptionInvoiceResponseDto } from '../dtos/GetSubscriptionInvoiceResponseDto.js';

@Injectable()
export class CreateSubscriptionInvoicePresenter {
  present(
    result: CreateSubscriptionInvoiceResult,
  ): GetSubscriptionInvoiceResponseDto {
    return new GetSubscriptionInvoiceResponseDto({
      id: result.data.invoice.id,
      subscriptionId: result.data.invoice.subscriptionId,
      userId: result.data.invoice.userId,
      status: result.data.invoice.status,
      amountDue: result.data.invoice.amountDue,
      amountPaid: result.data.invoice.amountPaid,
      currency: result.data.invoice.currency,
      periodStartAt: result.data.invoice.periodStartAt,
      periodEndAt: result.data.invoice.periodEndAt,
      issuedAt: result.data.invoice.issuedAt,
      dueAt: result.data.invoice.dueAt,
      paidAt: result.data.invoice.paidAt,
      failedAt: result.data.invoice.failedAt,
      voidedAt: result.data.invoice.voidedAt,
      provider: result.data.invoice.provider,
      providerInvoiceId: result.data.invoice.providerInvoiceId,
      providerPaymentIntentId:
        result.data.invoice.providerPaymentIntentId,
      checkoutUrl: result.data.invoice.checkoutUrl,
      failureCode: result.data.invoice.failureCode,
      failureMessage: result.data.invoice.failureMessage,
      metadata: result.data.invoice.metadata,
      createdAt: result.data.invoice.createdAt,
      updatedAt: result.data.invoice.updatedAt,
    });
  }
}
