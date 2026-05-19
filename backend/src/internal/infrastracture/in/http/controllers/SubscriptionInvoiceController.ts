import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { PaymentCreationFailedException } from '../../../../application/exceptions/PaymentCreationFailedException.js';
import { PaymentProviderNotSupportedException } from '../../../../application/exceptions/PaymentProviderNotSupportedException.js';
import { PlanNotFoundException } from '../../../../application/exceptions/PlanNotFoundException.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CreateSubscriptionInvoiceUseCase } from '../../../../application/usecases/CreateSubscriptionInvoiceUseCase.js';
import { GetSubscriptionInvoicesUseCase } from '../../../../application/usecases/GetSubscriptionInvoicesUseCase.js';
import { SubscriptionInvoiceActionForbiddenException } from '../../../../domain/subscription/SubscriptionInvoiceActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { CreateSubscriptionInvoiceRequestDto } from '../dtos/CreateSubscriptionInvoiceRequestDto.js';
import { GetSubscriptionInvoiceResponseDto } from '../dtos/GetSubscriptionInvoiceResponseDto.js';
import { GetSubscriptionInvoicesResponseDto } from '../dtos/GetSubscriptionInvoicesResponseDto.js';
import { CreateSubscriptionInvoicePresenter } from '../presenters/CreateSubscriptionInvoicePresenter.js';
import { GetSubscriptionInvoicesPresenter } from '../presenters/GetSubscriptionInvoicesPresenter.js';

@Controller('subscription-invoices')
export class SubscriptionInvoiceController {
  constructor(
    private readonly getSubscriptionInvoicesUseCase: GetSubscriptionInvoicesUseCase,
    private readonly getSubscriptionInvoicesPresenter: GetSubscriptionInvoicesPresenter,
    private readonly createSubscriptionInvoiceUseCase: CreateSubscriptionInvoiceUseCase,
    private readonly createSubscriptionInvoicePresenter: CreateSubscriptionInvoicePresenter,
  ) {}

  @ApiOkResponse({ type: GetSubscriptionInvoicesResponseDto })
  @Get()
  async handleGetSubscriptionInvoices(@Claims() claims: AuthClaim) {
    try {
      const result =
        await this.getSubscriptionInvoicesUseCase.execute({
          initiatorUserId: claims.sub,
        });

      return this.getSubscriptionInvoicesPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (
        error instanceof
        SubscriptionInvoiceActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetSubscriptionInvoiceResponseDto })
  @Post()
  async handleCreateSubscriptionInvoice(
    @Body()
    createSubscriptionInvoiceRequestDto: CreateSubscriptionInvoiceRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.createSubscriptionInvoiceUseCase.execute({
          initiatorUserId: claims.sub,
          planId: createSubscriptionInvoiceRequestDto.planId,
          provider: createSubscriptionInvoiceRequestDto.provider,
        });

      return this.createSubscriptionInvoicePresenter.present(
        result,
      );
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof PlanNotFoundException) {
        throw new NotFoundException('Plan does not exist.');
      }

      if (
        error instanceof PaymentProviderNotSupportedException
      ) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof PaymentCreationFailedException) {
        throw new BadGatewayException(
          'Payment provider request failed.',
        );
      }

      throw error;
    }
  }
}
