import { Injectable } from '@nestjs/common';
import { GetCurrentVpnSubscriptionResult } from '../../../../application/usecases/GetCurrentVpnSubscriptionUseCase.js';
import { GetVpnSubscriptionResponseDto } from '../dtos/GetVpnSubscriptionResponseDto.js';

@Injectable()
export class GetVpnSubscriptionPresenter {
  present(
    result: GetCurrentVpnSubscriptionResult,
  ): GetVpnSubscriptionResponseDto {
    return new GetVpnSubscriptionResponseDto({
      subscriptionUrl:
        result.data.vpnSubscription.subscriptionUrl,
    });
  }
}
