import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { InvoiceCreationFailedException } from '../../../../application/exceptions/InvoiceCreationFailedException.js';
import type {
  CreateInvoiceInput,
  InvoiceProvider,
} from '../../../../application/ports/InvoiceProvider.js';
import type { ExternalInvoice } from '../../../../application/models/ExternalInvoice.js';
import { InvoiceStatus } from '../../../../domain/subscription/InvoiceStatus.js';
import { BillingProvider } from '../../../../../internal/domain/subscription/BillingProvider.js';

interface NowPaymentsCreatePaymentResponse {
  id: string;
  invoice_url: string;
  order_id: string;
  order_description: string;
  price_amount: string;
  price_currency: string;
}

interface NowPaymentsFetchPaymentResponse {
  payment_id: string | number;
  payment_status: string;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  pay_address: string;
}

@Injectable()
export class NowPaymentsInvoiceProvider implements InvoiceProvider {
  private readonly provider = BillingProvider.NowPayments;

  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly ipnCallbackUrl: string;
  private readonly successRedirectUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>(
      'NOWPAYMENTS_BASE_URL',
    );
    this.apiKey = this.configService.getOrThrow<string>(
      'NOWPAYMENTS_API_KEY',
    );

    this.ipnCallbackUrl = this.configService.getOrThrow<string>(
      'IPN_CALLBACK_URL',
    );
    this.successRedirectUrl =
      this.configService.getOrThrow<string>(
        'PAYMENT_SUCCESS_REDIRECT_URL',
      );
  }

  async create(
    input: CreateInvoiceInput,
  ): Promise<ExternalInvoice> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<NowPaymentsCreatePaymentResponse>(
          `${this.baseUrl}/invoice`,
          {
            price_amount: input.amount,
            price_currency: input.currencyCode.toLowerCase(),
            ipn_callback_url: this.ipnCallbackUrl,
            order_id: input.invoiceId,
            order_description: input.description,
            success_url: this.successRedirectUrl,
          },
          {
            headers: {
              'x-api-key': this.apiKey,
            },
          },
        ),
      );

      const data = response.data;

      return {
        provider: this.provider,
        externalId: data.id,
        invoiceId: data.order_id,
        amount: input.amount,
        currencyCode: data.price_currency,
        externalCheckoutUrl: data.invoice_url,
        status: InvoiceStatus.Pending,
      };
    } catch {
      throw new InvoiceCreationFailedException();
    }
  }

  // async fetch(
  //   query: FetchInvoiceQuery,
  // ): Promise<ExternalInvoice | null> {
  //   if (!('externalId' in query.filters)) {
  //     return null;
  //   }

  //   const response = await firstValueFrom(
  //     this.httpService.get<NowPaymentsFetchPaymentResponse>(
  //       `${this.baseUrl}/payment/${query.filters.externalId}`,
  //       {
  //         headers: {
  //           'x-api-key': this.apiKey,
  //         },
  //       },
  //     ),
  //   );

  //   const data = response.data;

  //   return {
  //     externalId: String(data.payment_id),
  //     provider: InvoiceProvider.NowPayments,
  //     invoiceId: data.order_id,
  //     amount: data.price_amount,
  //     currencyCode: data.price_currency,
  //     externalCheckoutUrl: data.pay_address,
  //     status: this.mapInvoiceStatus(data.payment_status),
  //   };
  // }
}
