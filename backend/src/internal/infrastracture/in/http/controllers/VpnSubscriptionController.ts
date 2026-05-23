import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { VpnSubscriptionNotFoundException } from '../../../../application/exceptions/VpnSubscriptionNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetCurrentVpnSubscriptionUseCase } from '../../../../application/usecases/GetCurrentVpnSubscriptionUseCase.js';
import { GetCurrentVpnSubscriptionUsageUseCase } from '../../../../application/usecases/GetCurrentVpnSubscriptionUsageUseCase.js';
import { VpnSubscriptionActionForbiddenException } from '../../../../domain/subscription/VpnSubscriptionActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { GetVpnSubscriptionResponseDto } from '../dtos/GetVpnSubscriptionResponseDto.js';
import { GetVpnUsageResponseDto } from '../dtos/GetVpnUsageResponseDto.js';
import { GetVpnSubscriptionPresenter } from '../presenters/GetVpnSubscriptionPresenter.js';
import { GetVpnUsagePresenter } from '../presenters/GetVpnUsagePresenter.js';

@Controller('vpn-subscriptions')
export class VpnSubscriptionController {
  constructor(
    private readonly getCurrentVpnSubscriptionUseCase: GetCurrentVpnSubscriptionUseCase,
    private readonly getCurrentVpnSubscriptionUsageUseCase: GetCurrentVpnSubscriptionUsageUseCase,
    private readonly getVpnSubscriptionPresenter: GetVpnSubscriptionPresenter,
    private readonly getVpnUsagePresenter: GetVpnUsagePresenter,
  ) {}

  @ApiOkResponse({ type: GetVpnSubscriptionResponseDto })
  @Get('current')
  async handleGetCurrentVpnSubscription(
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.getCurrentVpnSubscriptionUseCase.execute({
          initiatorUserId: claims.sub,
        });

      return this.getVpnSubscriptionPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof VpnSubscriptionNotFoundException) {
        throw new NotFoundException(
          'VPN subscription does not exist.',
        );
      }

      if (
        error instanceof VpnSubscriptionActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetVpnUsageResponseDto })
  @Get('current/usage')
  async handleGetCurrentVpnSubscriptionUsage(
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.getCurrentVpnSubscriptionUsageUseCase.execute(
          {
            initiatorUserId: claims.sub,
          },
        );

      return this.getVpnUsagePresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof VpnSubscriptionNotFoundException) {
        throw new NotFoundException(
          'VPN subscription does not exist.',
        );
      }

      if (
        error instanceof VpnSubscriptionActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
