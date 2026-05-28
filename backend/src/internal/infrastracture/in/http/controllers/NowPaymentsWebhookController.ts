import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../decorators/Public.js';
import { NowPaymentsGuard } from '../guards/NowPaymentsGuard.js';
import { HandlePaymentStatusChangeUseCase } from '../../../../application/usecases/HandlePaymentStatusChangeUseCase.js';
import { BillingProvider } from '../../../../domain/subscription/BillingProvider.js';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { NowPaymentsPaymentStatusMapper } from '../../../shared/payment/mappers/NowPaymentsPaymentStatusMapper.js';

interface HandlePaymentStatusRequestBody {
  payment_id: number;
  invoice_id: number | null;
  payment_status:
    | 'waiting'
    | 'confirming'
    | 'confirmed'
    | 'sending'
    | 'partially_paid'
    | 'finished'
    | 'failed'
    | 'expired'
    | 'refunded';
  pay_address: string;
  payin_extra_id: string | null;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string | null;
  order_description: string | null;
  purchase_id: number;
  outcome_amount: number;
  outcome_currency: string;
  payout_hash: string | null;
  payin_hash: string | null;
  burning_percent: string | null;
  type: string;
  payment_extra_ids: number[];
  created_at: string;
  updated_at: string;
}

@Public()
@UseGuards(NowPaymentsGuard)
@Controller('webhooks/nowpayments')
export class NowPaymentsWebhookController {
  constructor(
    private readonly handlePaymentStatusChange: HandlePaymentStatusChangeUseCase,
    private readonly paymentStatusMapper: NowPaymentsPaymentStatusMapper,
  ) {}

  @Post('payment-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async handlePaymentStatus(
    @Body()
    handlePaymentStatusRequestBody: HandlePaymentStatusRequestBody,
  ) {
    const externalPaymentId =
      handlePaymentStatusRequestBody.payment_id;

    const externalInvoiceId =
      handlePaymentStatusRequestBody.invoice_id;

    const invoiceId = handlePaymentStatusRequestBody.order_id;

    await this.handlePaymentStatusChange.execute({
      externalId: String(externalPaymentId),
      invoiceId: invoiceId ?? undefined,
      externalInvoiceId: externalInvoiceId
        ? String(externalInvoiceId)
        : undefined,
      provider: BillingProvider.NowPayments,
      status: this.paymentStatusMapper.map(
        handlePaymentStatusRequestBody.payment_status,
      ),
      amount: handlePaymentStatusRequestBody.price_amount,
      currencyCode: handlePaymentStatusRequestBody.price_currency,
    });
  }
}
