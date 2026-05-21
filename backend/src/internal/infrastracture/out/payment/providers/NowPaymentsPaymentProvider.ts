import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { PaymentCreationFailedException } from '../../../../application/exceptions/PaymentCreationFailedException.js';
import type {
  CreatePaymentInput,
  FetchPaymentQuery,
  PaymentProvider as PaymentProviderPort,
} from '../../../../application/ports/PaymentProvider.js';
import type { ExternalPayment } from '../../../../application/models/ExternalPayment.js';
import { PaymentProvider } from '../../../../domain/subscription/PaymentProvider.js';
import { ExternalPaymentStatus } from '../../../../application/models/ExternalPaymentState.js';

interface NowPaymentsCreatePaymentResponse {
  id: string | number;
  invoice_url?: string;
  order_id?: string;
  order_description?: string;
  price_amount?: string;
  price_currency?: string;
}

interface NowPaymentsFetchPaymentResponse {
  payment_id: string | number;
  payment_status: string;
  order_id?: string;
  order_description?: string;
  price_amount?: string;
  price_currency?: string;
  pay_address?: string;
}

@Injectable()
export class NowPaymentsPaymentProvider implements PaymentProviderPort {
  static readonly providerName = PaymentProvider.NowPayments;

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
    input: CreatePaymentInput,
  ): Promise<ExternalPayment> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<NowPaymentsCreatePaymentResponse>(
          `${this.baseUrl}/invoice`,
          {
            price_amount: input.priceAmount,
            price_currency: input.priceCurrency.toLowerCase(),
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

      return {
        externalId: String(response.data.id),
        invoiceId: response.data.order_id ?? input.invoiceId,
        description:
          response.data.order_description ?? input.description,
        priceAmount:
          response.data.price_amount ?? input.priceAmount,
        priceCurrency:
          response.data.price_currency ??
          input.priceCurrency.toLowerCase(),
        checkoutUrl: response.data.invoice_url,
        status: ExternalPaymentStatus.Pending,
      };
    } catch {
      throw new PaymentCreationFailedException();
    }
  }

  async fetch(
    query: FetchPaymentQuery,
  ): Promise<ExternalPayment | null> {
    if (!('externalId' in query.filters)) {
      return null;
    }

    const response = await firstValueFrom(
      this.httpService.get<NowPaymentsFetchPaymentResponse>(
        `${this.baseUrl}/payment/${query.filters.externalId}`,
        {
          headers: {
            'x-api-key': this.apiKey,
          },
        },
      ),
    );

    return {
      externalId: String(response.data.payment_id),
      invoiceId: response.data.order_id ?? '',
      description: response.data.order_description ?? '',
      priceAmount: response.data.price_amount ?? '',
      priceCurrency: response.data.price_currency ?? '',
      checkoutUrl: response.data.pay_address,
      status: this.mapStatus(response.data.payment_status),
    };
  }

  private mapStatus(status: string): ExternalPaymentStatus {
    switch (status.toLowerCase()) {
      case 'finished':
        return ExternalPaymentStatus.Completed;
      case 'expired':
        return ExternalPaymentStatus.Expired;
      case 'failed':
        return ExternalPaymentStatus.Failed;
      default:
        return ExternalPaymentStatus.Pending;
    }
  }
}
