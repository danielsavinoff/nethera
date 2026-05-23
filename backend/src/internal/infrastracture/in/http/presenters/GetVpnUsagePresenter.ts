import { Injectable } from '@nestjs/common';
import { GetCurrentVpnSubscriptionUsageResult } from '../../../../application/usecases/GetCurrentVpnSubscriptionUsageUseCase.js';
import { GetVpnUsageResponseDto } from '../dtos/GetVpnUsageResponseDto.js';

@Injectable()
export class GetVpnUsagePresenter {
  present(
    result: GetCurrentVpnSubscriptionUsageResult,
  ): GetVpnUsageResponseDto {
    return new GetVpnUsageResponseDto({
      usage: this.toMegabytesByDate(result.data.usageBytes),
    });
  }

  private toMegabytesByDate(
    usageBytes: Record<string, number>,
  ): Record<string, number> {
    return Object.fromEntries(
      Object.entries(usageBytes).map(([date, bytes]) => [
        date,
        Number((bytes / 1024 / 1024).toFixed(2)),
      ]),
    );
  }
}
