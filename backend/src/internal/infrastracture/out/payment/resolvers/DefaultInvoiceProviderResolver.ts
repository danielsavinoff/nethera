import { Injectable } from '@nestjs/common';

import { BillingProviderNotSupportedException } from '../../../../application/exceptions/BillingProviderNotSupportedException.js';
import type { InvoiceProviderResolver } from '../../../../application/ports/InvoiceProviderResolver.js';
import type { InvoiceProvider as InvoiceProviderPort } from '../../../../application/ports/InvoiceProvider.js';
import { BillingProvider } from '../../../../domain/subscription/BillingProvider.js';

@Injectable()
export class DefaultInvoiceProviderResolver implements InvoiceProviderResolver {
  constructor(
    private readonly providers: Record<
      BillingProvider,
      InvoiceProviderPort | undefined
    >,
  ) {}

  resolve(provider: BillingProvider): InvoiceProviderPort {
    const invoiceProvider = this.providers[provider];

    if (!invoiceProvider) {
      throw new BillingProviderNotSupportedException(provider);
    }

    return invoiceProvider;
  }
}
