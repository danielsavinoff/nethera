import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { InvoiceCreationFailedException } from '../../../../application/exceptions/InvoiceCreationFailedException.js';
import { BillingProviderNotSupportedException } from '../../../../application/exceptions/BillingProviderNotSupportedException.js';
import { SubscriptionPriceNotFoundException } from '../../../../application/exceptions/SubscriptionPriceNotFoundException.js';
import { SubscriptionPlanNotFoundException } from '../../../../application/exceptions/SubscriptionPlanNotFoundException.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CreateInvoiceUseCase } from '../../../../application/usecases/CreateInvoiceUseCase.js';
import { GetInvoicesUseCase } from '../../../../application/usecases/GetInvoicesUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { CreateInvoiceRequestDto } from '../dtos/CreateInvoiceRequestDto.js';
import { GetInvoiceResponseDto } from '../dtos/GetInvoiceResponseDto.js';
import { GetInvoicesResponseDto } from '../dtos/GetInvoicesResponseDto.js';
import { CreateInvoicePresenter } from '../presenters/CreateInvoicePresenter.js';
import { GetInvoicesPresenter } from '../presenters/GetInvoicesPresenter.js';

@Controller('invoices')
@ApiHeader({ name: 'Accept-Language', required: false })
export class InvoiceController {
  private readonly fallbackLanguage: string;

  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly createInvoicePresenter: CreateInvoicePresenter,
    private readonly getInvoicesUseCase: GetInvoicesUseCase,
    private readonly getInvoicesPresenter: GetInvoicesPresenter,
    private readonly configService: ConfigService,
  ) {
    this.fallbackLanguage =
      this.configService.getOrThrow<string>('FALLBACK_LANGUAGE');
  }

  @ApiOkResponse({ type: GetInvoicesResponseDto })
  @Get()
  async handleGetInvoices(
    @Claims() claims: AuthClaim,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result = await this.getInvoicesUseCase.execute({
        initiatorUserId: claims.sub,
        locale: acceptLanguage ?? this.fallbackLanguage,
      });

      return this.getInvoicesPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetInvoiceResponseDto })
  @Post()
  async handleCreateInvoice(
    @Body()
    createInvoiceRequestDto: CreateInvoiceRequestDto,
    @Claims() claims: AuthClaim,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result = await this.createInvoiceUseCase.execute({
        initiatorUserId: claims.sub,
        subscriptionPlanId:
          createInvoiceRequestDto.subscriptionPlanId,
        provider: createInvoiceRequestDto.provider,
        locale: acceptLanguage ?? this.fallbackLanguage,
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
