import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { InvoiceCreationFailedException } from '../../../../application/exceptions/InvoiceCreationFailedException.js';
import { InvoiceNotFoundException } from '../../../../application/exceptions/InvoiceNotFoundException.js';
import { BillingProviderNotSupportedException } from '../../../../application/exceptions/BillingProviderNotSupportedException.js';
import { SubscriptionPriceNotFoundException } from '../../../../application/exceptions/SubscriptionPriceNotFoundException.js';
import { SubscriptionPlanNotFoundException } from '../../../../application/exceptions/SubscriptionPlanNotFoundException.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CreateInvoiceUseCase } from '../../../../application/usecases/CreateInvoiceUseCase.js';
import { GetInvoiceUseCase } from '../../../../application/usecases/GetInvoiceUseCase.js';
import { GetInvoiceLinesUseCase } from '../../../../application/usecases/GetInvoiceLinesUseCase.js';
import { GetInvoicesUseCase } from '../../../../application/usecases/GetInvoicesUseCase.js';
import { InvoiceActionForbiddenException } from '../../../../domain/subscription/InvoiceActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { CreateInvoiceRequestDto } from '../dtos/CreateInvoiceRequestDto.js';
import { GetInvoiceLinesResponseDto } from '../dtos/GetInvoiceLinesResponseDto.js';
import { GetInvoiceResponseDto } from '../dtos/GetInvoiceResponseDto.js';
import { GetInvoicesResponseDto } from '../dtos/GetInvoicesResponseDto.js';
import { CreateInvoicePresenter } from '../presenters/CreateInvoicePresenter.js';
import { GetInvoicePresenter } from '../presenters/GetInvoicePresenter.js';
import { GetInvoiceLinesPresenter } from '../presenters/GetInvoiceLinesPresenter.js';
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
    private readonly getInvoiceUseCase: GetInvoiceUseCase,
    private readonly getInvoicePresenter: GetInvoicePresenter,
    private readonly getInvoiceLinesUseCase: GetInvoiceLinesUseCase,
    private readonly getInvoiceLinesPresenter: GetInvoiceLinesPresenter,
    private readonly configService: ConfigService,
  ) {
    this.fallbackLanguage =
      this.configService.getOrThrow<string>('FALLBACK_LANGUAGE');
  }

  @ApiOkResponse({ type: GetInvoiceResponseDto })
  @Get(':id')
  async handleGetInvoice(
    @Claims() claims: AuthClaim,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new NotFoundException('Invoice does not exist.'),
      }),
    )
    id: string,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result = await this.getInvoiceUseCase.execute({
        initiatorUserId: claims.sub,
        invoiceId: id,
        locale: acceptLanguage ?? this.fallbackLanguage,
      });

      return this.getInvoicePresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof InvoiceNotFoundException) {
        throw new NotFoundException('Invoice does not exist.');
      }

      if (error instanceof InvoiceActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetInvoiceLinesResponseDto })
  @Get(':id/lines')
  async handleGetInvoiceLines(
    @Claims() claims: AuthClaim,
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new NotFoundException('Invoice does not exist.'),
      }),
    )
    id: string,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result = await this.getInvoiceLinesUseCase.execute({
        initiatorUserId: claims.sub,
        invoiceId: id,
        locale: acceptLanguage ?? this.fallbackLanguage,
      });

      return this.getInvoiceLinesPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof InvoiceNotFoundException) {
        throw new NotFoundException('Invoice does not exist.');
      }

      if (error instanceof InvoiceActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
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
        type: createInvoiceRequestDto.type,
        referenceId: createInvoiceRequestDto.referenceId,
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
