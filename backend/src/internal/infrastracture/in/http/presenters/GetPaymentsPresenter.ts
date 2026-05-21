import { Injectable } from '@nestjs/common';
import { GetPaymentsResult } from '../../../../application/usecases/GetPaymentsUseCase.js';
import { GetPaymentResponseDto } from '../dtos/GetPaymentResponseDto.js';
import { GetPaymentsResponseDto } from '../dtos/GetPaymentsResponseDto.js';

@Injectable()
export class GetPaymentsPresenter {
  present(result: GetPaymentsResult): GetPaymentsResponseDto {
    return new GetPaymentsResponseDto({
      payments: result.data.payments.map(
        (payment) =>
          new GetPaymentResponseDto({
            id: payment.id,
            userId: payment.userId,
            status: payment.status,
            amountMinor: payment.amountMinor,
            currency: payment.currency,
            dueAt: payment.dueAt,
            paidAt: payment.paidAt,
            failedAt: payment.failedAt,
            voidedAt: payment.voidedAt,
            provider: payment.provider,
            externalId: payment.externalId,
            failureCode: payment.failureCode,
            failureMessage: payment.failureMessage,
            metadata: payment.metadata,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
          }),
      ),
    });
  }
}
