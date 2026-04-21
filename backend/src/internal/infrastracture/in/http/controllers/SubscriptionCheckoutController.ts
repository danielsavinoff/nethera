import {
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { PlanNotFoundException } from '../../../../application/exceptions/PlanNotFoundException.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CreateSubscriptionCheckoutUseCase } from '../../../../application/usecases/CreateSubscriptionCheckoutUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { CreateSubscriptionCheckoutRequestDto } from '../dtos/CreateSubscriptionCheckoutRequestDto.js';
import { CreateSubscriptionCheckoutResponseDto } from '../dtos/CreateSubscriptionCheckoutResponseDto.js';
import { CreateSubscriptionCheckoutPresenter } from '../presenters/CreateSubscriptionCheckoutPresenter.js';

@Controller('checkouts')
export class SubscriptionCheckoutController {
  constructor(
    private readonly createSubscriptionCheckoutUseCase: CreateSubscriptionCheckoutUseCase,
    private readonly createSubscriptionCheckoutPresenter: CreateSubscriptionCheckoutPresenter,
  ) {}

  @ApiOkResponse({ type: CreateSubscriptionCheckoutResponseDto })
  @Post()
  async handleCreateSubscriptionCheckout(
    @Body()
    createSubscriptionCheckoutRequestDto: CreateSubscriptionCheckoutRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.createSubscriptionCheckoutUseCase.execute({
          initiatorUserId: claims.sub,
          planId: createSubscriptionCheckoutRequestDto.planId,
          provider:
            createSubscriptionCheckoutRequestDto.provider,
        });

      return this.createSubscriptionCheckoutPresenter.present(
        result,
      );
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof PlanNotFoundException) {
        throw new NotFoundException('Plan does not exist.');
      }

      throw error;
    }
  }
}
