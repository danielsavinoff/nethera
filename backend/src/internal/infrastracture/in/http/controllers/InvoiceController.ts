import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { InvoiceCreationFailedException } from '../../../../application/exceptions/InvoiceCreationFailedException.js';
import { BillingProviderNotSupportedException } from '../../../../application/exceptions/BillingProviderNotSupportedException.js';
import { SubscriptionPriceNotFoundException } from '../../../../application/exceptions/SubscriptionPriceNotFoundException.js';
import { SubscriptionPlanNotFoundException } from '../../../../application/exceptions/SubscriptionPlanNotFoundException.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CreateInvoiceUseCase } from '../../../../application/usecases/CreateInvoiceUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { CreateInvoiceRequestDto } from '../dtos/CreateInvoiceRequestDto.js';
import { GetInvoiceResponseDto } from '../dtos/GetInvoiceResponseDto.js';
import { CreateInvoicePresenter } from '../presenters/CreateInvoicePresenter.js';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly createInvoicePresenter: CreateInvoicePresenter,
  ) {}

  @ApiOkResponse({ type: GetInvoiceResponseDto })
  @Post()
  async createInvoice(
    @Body()
    createInvoiceRequestDto: CreateInvoiceRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.createInvoiceUseCase.execute({
        initiatorUserId: claims.sub,
        subscriptionPlanId:
          createInvoiceRequestDto.subscriptionPlanId,
        provider: createInvoiceRequestDto.provider,
      });

      return this.createInvoicePresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof SubscriptionPlanNotFoundException) {
        throw new NotFoundException(
          'Subscription plan does not exist.',
        );
      }

      if (error instanceof SubscriptionPriceNotFoundException) {
        throw new NotFoundException(
          'Subscription price does not exist.',
        );
      }

      if (
        error instanceof BillingProviderNotSupportedException
      ) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof InvoiceCreationFailedException) {
        throw new BadGatewayException(
          'Invoice provider request failed.',
        );
      }

      throw error;
    }
  }
}
