import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NowPaymentsInvoiceProvider } from './providers/NowPaymentsInvoiceProvider.js';
import { BillingProvider } from '../../../domain/subscription/BillingProvider.js';
import type { InvoiceProvider as InvoiceProviderPort } from '../../../application/ports/InvoiceProvider.js';
import { DefaultInvoiceProviderResolver } from './resolvers/DefaultInvoiceProviderResolver.js';

const BILLING_PROVIDERS = Symbol('BILLING_PROVIDERS');

@Module({
  imports: [HttpModule],
  providers: [
    NowPaymentsInvoiceProvider,
    {
      provide: BILLING_PROVIDERS,
      useFactory: (
        nowPaymentsInvoiceProvider: InvoiceProviderPort,
      ) =>
        ({
          [BillingProvider.NowPayments]:
            nowPaymentsInvoiceProvider,
        }) satisfies Record<
          BillingProvider,
          InvoiceProviderPort | undefined
        >,
      inject: [NowPaymentsInvoiceProvider],
    },
    {
      provide: DefaultInvoiceProviderResolver,
      useFactory: (
        billingProviders: Record<
          BillingProvider,
          InvoiceProviderPort | undefined
        >,
      ) => {
        return new DefaultInvoiceProviderResolver(
          billingProviders,
        );
      },
      inject: [BILLING_PROVIDERS],
    },
  ],
  exports: [
    NowPaymentsInvoiceProvider,
    DefaultInvoiceProviderResolver,
  ],
})
export class InvoiceModule {}
