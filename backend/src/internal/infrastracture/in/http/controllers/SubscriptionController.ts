import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { BillingProviderNotSupportedException } from '../../../../application/exceptions/BillingProviderNotSupportedException.js';
import { InvoiceCreationFailedException } from '../../../../application/exceptions/InvoiceCreationFailedException.js';
import { SubscriptionPlanNotFoundException } from '../../../../application/exceptions/SubscriptionPlanNotFoundException.js';
import { SubscriptionPriceNotFoundException } from '../../../../application/exceptions/SubscriptionPriceNotFoundException.js';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { SubscriptionNotFoundException } from '../../../../application/exceptions/SubscriptionNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CancelSubscriptionUseCase } from '../../../../application/usecases/CancelSubscriptionUseCase.js';
import { ExtendSubscriptionUseCase } from '../../../../application/usecases/ExtendSubscriptionUseCase.js';
import { GetCurrentSubscriptionUseCase } from '../../../../application/usecases/GetCurrentSubscriptionUseCase.js';
import { GetSubscriptionUseCase } from '../../../../application/usecases/GetSubscriptionUseCase.js';
import { GetSubscriptionsUseCase } from '../../../../application/usecases/GetSubscriptionsUseCase.js';
import { SubscriptionCannotBeCanceledException } from '../../../../domain/subscription/SubscriptionCannotBeCanceledException.js';
import { SubscriptionActionForbiddenException } from '../../../../domain/subscription/SubscriptionActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { CancelSubscriptionResponseDto } from '../dtos/CancelSubscriptionResponseDto.js';
import { ExtendSubscriptionRequestDto } from '../dtos/ExtendSubscriptionRequestDto.js';
import { GetInvoiceResponseDto } from '../dtos/GetInvoiceResponseDto.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';
import { GetSubscriptionsResponseDto } from '../dtos/GetSubscriptionsResponseDto.js';
import { CancelSubscriptionPresenter } from '../presenters/CancelSubscriptionPresenter.js';
import { ExtendSubscriptionPresenter } from '../presenters/ExtendSubscriptionPresenter.js';
import { GetSubscriptionPresenter } from '../presenters/GetSubscriptionPresenter.js';
import { GetSubscriptionsPresenter } from '../presenters/GetSubscriptionsPresenter.js';
import { ConfigService } from '@nestjs/config';

@Controller('subscriptions')
@ApiHeader({ name: 'Accept-Language', required: false })
export class SubscriptionController {
  private readonly fallbackLocale: string;

  constructor(
    private readonly getSubscriptionsUseCase: GetSubscriptionsUseCase,
    private readonly getSubscriptionsPresenter: GetSubscriptionsPresenter,
    private readonly getCurrentSubscriptionUseCase: GetCurrentSubscriptionUseCase,
    private readonly getSubscriptionUseCase: GetSubscriptionUseCase,
    private readonly getSubscriptionPresenter: GetSubscriptionPresenter,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private readonly cancelSubscriptionPresenter: CancelSubscriptionPresenter,
    private readonly extendSubscriptionUseCase: ExtendSubscriptionUseCase,
    private readonly extendSubscriptionPresenter: ExtendSubscriptionPresenter,
    private readonly configService: ConfigService,
  ) {
    this.fallbackLocale = this.configService.getOrThrow<string>(
      'FALLBACK_LANGUAGE',
    );
  }

  @ApiOkResponse({ type: GetSubscriptionsResponseDto })
  @Get()
  async handleGetSubscriptions(
    @Claims() claims: AuthClaim,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result = await this.getSubscriptionsUseCase.execute({
        initiatorUserId: claims.sub,
        locale: acceptLanguage,
      });

      return this.getSubscriptionsPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (
        error instanceof SubscriptionActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetSubscriptionResponseDto })
  @Get('current')
  async handleGetCurrentSubscription(
    @Claims() claims: AuthClaim,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result =
        await this.getCurrentSubscriptionUseCase.execute({
          initiatorUserId: claims.sub,
          locale: acceptLanguage,
        });

      return this.getSubscriptionPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof SubscriptionNotFoundException) {
        throw new NotFoundException(
          'Subscription does not exist.',
        );
      }

      if (
        error instanceof SubscriptionActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetInvoiceResponseDto })
  @Post('current/extend')
  async handleExtendCurrentSubscription(
    @Body()
    extendSubscriptionRequestDto: ExtendSubscriptionRequestDto,
    @Claims() claims: AuthClaim,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result =
        await this.extendSubscriptionUseCase.execute({
          initiatorUserId: claims.sub,
          provider: extendSubscriptionRequestDto.provider,
          locale: acceptLanguage,
        });

      return this.extendSubscriptionPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof SubscriptionNotFoundException) {
        throw new NotFoundException(
          'Subscription does not exist.',
        );
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

      if (
        error instanceof SubscriptionActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: CancelSubscriptionResponseDto })
  @Delete('current')
  async handleCancelCurrentSubscription(
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.cancelSubscriptionUseCase.execute({
          initiatorUserId: claims.sub,
        });

      return this.cancelSubscriptionPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof SubscriptionNotFoundException) {
        throw new NotFoundException(
          'Subscription does not exist.',
        );
      }

      if (
        error instanceof SubscriptionCannotBeCanceledException
      ) {
        throw new ForbiddenException(error.message);
      }

      if (
        error instanceof SubscriptionActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetSubscriptionResponseDto })
  @Get(':id')
  async handleGetSubscription(
    @Param('id') subscriptionId: string,
    @Claims() claims: AuthClaim,
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    try {
      const result = await this.getSubscriptionUseCase.execute({
        initiatorUserId: claims.sub,
        subscriptionId,
        locale: acceptLanguage,
      });

      return this.getSubscriptionPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof SubscriptionNotFoundException) {
        throw new NotFoundException(
          'Subscription does not exist.',
        );
      }

      if (
        error instanceof SubscriptionActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
