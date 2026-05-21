import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '../../../../domain/subscription/PaymentStatus.js';

@Injectable()
export class NowPaymentsPaymentStatusMapper {
  map(status: string): PaymentStatus {
    switch (status.toLowerCase()) {
      case 'finished':
        return PaymentStatus.Paid;
      case 'expired':
        return PaymentStatus.Void;
      case 'failed':
        return PaymentStatus.Failed;
      default:
        return PaymentStatus.Open;
    }
  }
}
