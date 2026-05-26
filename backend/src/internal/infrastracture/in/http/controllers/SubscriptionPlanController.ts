import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CreateSubscriptionPlanUseCase } from '../../../../application/usecases/CreateSubscriptionPlanUseCase.js';
import { GetSubscriptionPlanUseCase } from '../../../../application/usecases/GetSubscriptionPlanUseCase.js';
import { GetSubscriptionPlansUseCase } from '../../../../application/usecases/GetSubscriptionPlansUseCase.js';
import { SubscriptionPlanNotFoundException } from '../../../../application/exceptions/SubscriptionPlanNotFoundException.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { Claims } from '../decorators/Claims.js';
import { CreateSubscriptionPlanRequestDto } from '../dtos/CreateSubscriptionPlanRequestDto.js';
import { CreateSubscriptionPlanResponseDto } from '../dtos/CreateSubscriptionPlanResponseDto.js';
import { GetSubscriptionPlansQueryDto } from '../dtos/GetSubscriptionPlansQueryDto.js';
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';
import { GetSubscriptionPlansResponseDto } from '../dtos/GetSubscriptionPlansResponseDto.js';
import { CreateSubscriptionPlanPresenter } from '../presenters/CreateSubscriptionPlanPresenter.js';
import { GetSubscriptionPlanPresenter } from '../presenters/GetSubscriptionPlanPresenter.js';
import { GetSubscriptionPlansPresenter } from '../presenters/GetSubscriptionPlansPresenter.js';
import { SubscriptionPlanActionForbiddenException } from '../../../../domain/subscription/SubscriptionPlanActionForbiddenException.js';

@Controller('subscription-plans')
export class SubscriptionPlanController {
  private readonly fallbackLocale: string;

  constructor(
    private readonly getSubscriptionPlansUseCase: GetSubscriptionPlansUseCase,
    private readonly getSubscriptionPlansPresenter: GetSubscriptionPlansPresenter,
    private readonly getSubscriptionPlanUseCase: GetSubscriptionPlanUseCase,
    private readonly getSubscriptionPlanPresenter: GetSubscriptionPlanPresenter,
    private readonly createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    private readonly createSubscriptionPlanPresenter: CreateSubscriptionPlanPresenter,
    private readonly configService: ConfigService,
  ) {
    this.fallbackLocale = this.configService.getOrThrow<string>(
      'FALLBACK_LANGUAGE',
    );
  }

  @ApiOkResponse({ type: GetSubscriptionPlansResponseDto })
  @Get()
  async getSubscriptionPlans(
    @Claims() claims: AuthClaim,
    @Query() query: GetSubscriptionPlansQueryDto,
  ) {
    try {
      const billingIntervalCount = query.count
        ? Number(query.count)
        : undefined;

      const result =
        await this.getSubscriptionPlansUseCase.execute({
          initiatorUserId: claims.sub,
          locale: this.fallbackLocale,
          onlyPublic: true,
          billingInterval: query.interval,
          billingIntervalCount: billingIntervalCount,
        });

      return this.getSubscriptionPlansPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (
        error instanceof SubscriptionPlanActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetSubscriptionPlanResponseDto })
  @Get(':id')
  async getSubscriptionPlan(
    @Param('id') subscriptionPlanId: string,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.getSubscriptionPlanUseCase.execute({
          initiatorUserId: claims.sub,
          subscriptionPlanId,
          locale: this.fallbackLocale,
        });

      return this.getSubscriptionPlanPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof SubscriptionPlanNotFoundException) {
        throw new NotFoundException(
          'Subscription plan does not exist.',
        );
      }

      if (
        error instanceof SubscriptionPlanActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: CreateSubscriptionPlanResponseDto })
  @Post()
  async createSubscriptionPlan(
    @Body()
    createSubscriptionPlanRequestDto: CreateSubscriptionPlanRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.createSubscriptionPlanUseCase.execute({
          initiatorUserId: claims.sub,
          code: createSubscriptionPlanRequestDto.code,
          billingInterval:
            createSubscriptionPlanRequestDto.billingInterval,
          billingIntervalCount:
            createSubscriptionPlanRequestDto.billingIntervalCount,
          trialDays: createSubscriptionPlanRequestDto.trialDays,
          isPublic: createSubscriptionPlanRequestDto.isPublic,
          translations:
            createSubscriptionPlanRequestDto.translations,
          features: createSubscriptionPlanRequestDto.features,
          prices: createSubscriptionPlanRequestDto.prices,
        });

      return this.createSubscriptionPlanPresenter.present(
        result,
      );
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (
        error instanceof SubscriptionPlanActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
