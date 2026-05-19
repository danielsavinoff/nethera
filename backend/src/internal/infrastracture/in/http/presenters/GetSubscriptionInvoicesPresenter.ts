import { Injectable } from '@nestjs/common';
import { GetSubscriptionInvoicesResult } from '../../../../application/usecases/GetSubscriptionInvoicesUseCase.js';
import { GetSubscriptionInvoiceResponseDto } from '../dtos/GetSubscriptionInvoiceResponseDto.js';
import { GetSubscriptionInvoicesResponseDto } from '../dtos/GetSubscriptionInvoicesResponseDto.js';

@Injectable()
export class GetSubscriptionInvoicesPresenter {
  present(
    result: GetSubscriptionInvoicesResult,
  ): GetSubscriptionInvoicesResponseDto {
    return new GetSubscriptionInvoicesResponseDto({
      invoices: result.data.invoices.map(
        (invoice) =>
          new GetSubscriptionInvoiceResponseDto({
            id: invoice.id,
            subscriptionId: invoice.subscriptionId,
            userId: invoice.userId,
            status: invoice.status,
            amountDue: invoice.amountDue,
            amountPaid: invoice.amountPaid,
            currency: invoice.currency,
            periodStartAt: invoice.periodStartAt,
            periodEndAt: invoice.periodEndAt,
            issuedAt: invoice.issuedAt,
            dueAt: invoice.dueAt,
            paidAt: invoice.paidAt,
            failedAt: invoice.failedAt,
            voidedAt: invoice.voidedAt,
            provider: invoice.provider,
            providerInvoiceId: invoice.providerInvoiceId,
            providerPaymentIntentId:
              invoice.providerPaymentIntentId,
            checkoutUrl: invoice.checkoutUrl,
            failureCode: invoice.failureCode,
            failureMessage: invoice.failureMessage,
            metadata: invoice.metadata,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
          }),
      ),
    });
  }
}
