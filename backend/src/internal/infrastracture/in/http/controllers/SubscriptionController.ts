import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { SubscriptionNotFoundException } from '../../../../application/exceptions/SubscriptionNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CancelSubscriptionUseCase } from '../../../../application/usecases/CancelSubscriptionUseCase.js';
import { GetCurrentSubscriptionUseCase } from '../../../../application/usecases/GetCurrentSubscriptionUseCase.js';
import { GetSubscriptionUseCase } from '../../../../application/usecases/GetSubscriptionUseCase.js';
import { GetSubscriptionsUseCase } from '../../../../application/usecases/GetSubscriptionsUseCase.js';
import { SubscriptionCannotBeCanceledException } from '../../../../domain/subscription/SubscriptionCannotBeCanceledException.js';
import { SubscriptionActionForbiddenException } from '../../../../domain/subscription/SubscriptionActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { CancelSubscriptionResponseDto } from '../dtos/CancelSubscriptionResponseDto.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';
import { GetSubscriptionsResponseDto } from '../dtos/GetSubscriptionsResponseDto.js';
import { CancelSubscriptionPresenter } from '../presenters/CancelSubscriptionPresenter.js';
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
    @Headers('accept-language') acceptLanguage: string,
  ) {
    try {
      const result = await this.getSubscriptionsUseCase.execute({
        initiatorUserId: claims.sub,
        locale: this.getLocale(acceptLanguage),
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
    @Headers('accept-language') acceptLanguage: string,
  ) {
    try {
      const result =
        await this.getCurrentSubscriptionUseCase.execute({
          initiatorUserId: claims.sub,
          locale: this.getLocale(acceptLanguage),
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
    @Headers('accept-language') acceptLanguage: string,
  ) {
    try {
      const result = await this.getSubscriptionUseCase.execute({
        initiatorUserId: claims.sub,
        subscriptionId,
        locale: this.getLocale(acceptLanguage),
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

  private getLocale(acceptLanguage?: string): string {
    return (
      acceptLanguage?.split(',')[0]?.trim() ||
      this.fallbackLocale
    );
  }
}
