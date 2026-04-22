import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NowPaymentsPaymentProvider } from './providers/NowPaymentsPaymentProvider.js';
import { PaymentProvider } from '../../../domain/subscription/PaymentProvider.js';
import type { PaymentProvider as PaymentProviderPort } from '../../../application/ports/PaymentProvider.js';
import { DefaultPaymentProviderResolver } from './resolvers/DefaultPaymentProviderResolver.js';

const PAYMENT_PROVIDERS = Symbol('PAYMENT_PROVIDERS');

@Module({
  imports: [HttpModule],
  providers: [
    NowPaymentsPaymentProvider,
    {
      provide: PAYMENT_PROVIDERS,
      useFactory: (
        nowPaymentsPaymentProvider: PaymentProviderPort,
      ) =>
        ({
          [PaymentProvider.NowPayments]:
            nowPaymentsPaymentProvider,
        }) satisfies Record<
          PaymentProvider,
          PaymentProviderPort | undefined
        >,
      inject: [NowPaymentsPaymentProvider],
    },
    {
      provide: DefaultPaymentProviderResolver,
      useFactory: (
        paymentProviders: Record<
          PaymentProvider,
          PaymentProviderPort | undefined
        >,
      ) => {
        return new DefaultPaymentProviderResolver(
          paymentProviders,
        );
      },
      inject: [PAYMENT_PROVIDERS],
    },
  ],
  exports: [
    NowPaymentsPaymentProvider,
    DefaultPaymentProviderResolver,
  ],
})
export class PaymentModule {}
