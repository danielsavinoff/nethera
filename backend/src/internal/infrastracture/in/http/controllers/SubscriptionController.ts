import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { SubscriptionNotFoundException } from '../../../../application/exceptions/SubscriptionNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetSubscriptionUseCase } from '../../../../application/usecases/GetSubscriptionUseCase.js';
import { SubscriptionActionForbiddenException } from '../../../../domain/subscription/SubscriptionActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { GetSubscriptionResponseDto } from '../dtos/GetSubscriptionResponseDto.js';
import { GetSubscriptionPresenter } from '../presenters/GetSubscriptionPresenter.js';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly getSubscriptionUseCase: GetSubscriptionUseCase,
    private readonly getSubscriptionPresenter: GetSubscriptionPresenter,
  ) {}

  @ApiOkResponse({ type: GetSubscriptionResponseDto })
  @Get(':id')
  async handleGetSubscription(
    @Param('id') subscriptionId: string,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.getSubscriptionUseCase.execute({
        initiatorUserId: claims.sub,
        subscriptionId,
      });

      return this.getSubscriptionPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof SubscriptionNotFoundException) {
        throw new NotFoundException('Subscription does not exist.');
      }

      if (error instanceof SubscriptionActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
