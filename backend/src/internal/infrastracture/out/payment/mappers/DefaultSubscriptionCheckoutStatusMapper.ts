import { Injectable } from '@nestjs/common';

import { ExternalPaymentStatus } from '../../../../application/models/ExternalPayment.js';
import type { SubscriptionCheckoutStatusMapper } from '../../../../application/ports/SubscriptionCheckoutStatusMapper.js';
import { SubscriptionCheckoutStatus } from '../../../../domain/subscription/SubscriptionCheckoutStatus.js';

@Injectable()
export class DefaultSubscriptionCheckoutStatusMapper implements SubscriptionCheckoutStatusMapper {
  map(
    payment: ExternalPaymentStatus,
  ): SubscriptionCheckoutStatus {
    switch (payment) {
      case ExternalPaymentStatus.Completed:
        return SubscriptionCheckoutStatus.Completed;
      case ExternalPaymentStatus.Expired:
        return SubscriptionCheckoutStatus.Expired;
      case ExternalPaymentStatus.Failed:
        return SubscriptionCheckoutStatus.Failed;
      default:
        return SubscriptionCheckoutStatus.Pending;
    }
  }
}
