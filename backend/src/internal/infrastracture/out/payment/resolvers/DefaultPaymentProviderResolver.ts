import { Injectable } from '@nestjs/common';

import { PaymentProviderNotSupportedException } from '../../../../application/exceptions/PaymentProviderNotSupportedException.js';
import type { PaymentProviderResolver } from '../../../../application/ports/PaymentProviderResolver.js';
import type { PaymentProvider as PaymentProviderPort } from '../../../../application/ports/PaymentProvider.js';
import { PaymentProvider } from '../../../../domain/subscription/PaymentProvider.js';

@Injectable()
export class DefaultPaymentProviderResolver implements PaymentProviderResolver {
  constructor(
    private readonly providers: Record<
      PaymentProvider,
      PaymentProviderPort | undefined
    >,
  ) {}

  resolve(provider: PaymentProvider): PaymentProviderPort {
    const paymentProvider = this.providers[provider];

    if (!paymentProvider) {
      throw new PaymentProviderNotSupportedException(provider);
    }

    return paymentProvider;
  }
}
