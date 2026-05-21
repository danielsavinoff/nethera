import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
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
import { GetSubscriptionPlanResponseDto } from '../dtos/GetSubscriptionPlanResponseDto.js';
import { GetSubscriptionPlansResponseDto } from '../dtos/GetSubscriptionPlansResponseDto.js';
import { CreateSubscriptionPlanPresenter } from '../presenters/CreateSubscriptionPlanPresenter.js';
import { GetSubscriptionPlanPresenter } from '../presenters/GetSubscriptionPlanPresenter.js';
import { GetSubscriptionPlansPresenter } from '../presenters/GetSubscriptionPlansPresenter.js';
import { SubscriptionPlanActionForbiddenException } from '../../../../domain/subscription/SubscriptionPlanActionForbiddenException.js';

@Controller('subscription-plans')
export class SubscriptionPlanController {
  constructor(
    private readonly getSubscriptionPlansUseCase: GetSubscriptionPlansUseCase,
    private readonly getSubscriptionPlansPresenter: GetSubscriptionPlansPresenter,
    private readonly getSubscriptionPlanUseCase: GetSubscriptionPlanUseCase,
    private readonly getSubscriptionPlanPresenter: GetSubscriptionPlanPresenter,
    private readonly createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    private readonly createSubscriptionPlanPresenter: CreateSubscriptionPlanPresenter,
  ) {}

  @ApiOkResponse({ type: GetSubscriptionPlansResponseDto })
  @Get()
  async getSubscriptionPlans(@Claims() claims: AuthClaim) {
    try {
      const result =
        await this.getSubscriptionPlansUseCase.execute({
          initiatorUserId: claims.sub,
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
          active: createSubscriptionPlanRequestDto.active,
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
