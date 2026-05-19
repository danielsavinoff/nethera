import { Injectable } from '@nestjs/common';

import { ExternalPaymentStatus } from '../../../../application/models/ExternalPayment.js';
import type { SubscriptionInvoiceStatusMapper } from '../../../../application/ports/SubscriptionInvoiceStatusMapper.js';
import { InvoiceStatus } from '../../../../domain/subscription/InvoiceStatus.js';

@Injectable()
export class DefaultSubscriptionInvoiceStatusMapper implements SubscriptionInvoiceStatusMapper {
  map(payment: ExternalPaymentStatus): InvoiceStatus {
    switch (payment) {
      case ExternalPaymentStatus.Completed:
        return InvoiceStatus.Paid;
      case ExternalPaymentStatus.Expired:
        return InvoiceStatus.Void;
      case ExternalPaymentStatus.Failed:
        return InvoiceStatus.Failed;
      default:
        return InvoiceStatus.Open;
    }
  }
}
