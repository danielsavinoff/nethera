import { Injectable } from '@nestjs/common';
import { CreateSubscriptionCheckoutResult } from '../../../../application/usecases/CreateSubscriptionCheckoutUseCase.js';
import { CreateSubscriptionCheckoutResponseDto } from '../dtos/CreateSubscriptionCheckoutResponseDto.js';

@Injectable()
export class CreateSubscriptionCheckoutPresenter {
  present(
    result: CreateSubscriptionCheckoutResult,
  ): CreateSubscriptionCheckoutResponseDto {
    return new CreateSubscriptionCheckoutResponseDto({
      id: result.data.subscriptionCheckout.id,
      userId: result.data.subscriptionCheckout.userId,
      planId: result.data.subscriptionCheckout.planId,
      status: result.data.subscriptionCheckout.status,
      provider: result.data.subscriptionCheckout.provider,
      providerSessionId:
        result.data.subscriptionCheckout.providerSessionId,
      checkoutUrl: result.data.subscriptionCheckout.checkoutUrl,
      expiresAt: result.data.subscriptionCheckout.expiresAt,
      completedAt: result.data.subscriptionCheckout.completedAt,
      failedAt: result.data.subscriptionCheckout.failedAt,
    });
  }
}
