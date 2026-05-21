import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetPaymentsUseCase } from '../../../../application/usecases/GetPaymentsUseCase.js';
import { PaymentActionForbiddenException } from '../../../../domain/subscription/PaymentActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { GetPaymentsResponseDto } from '../dtos/GetPaymentsResponseDto.js';
import { GetPaymentsPresenter } from '../presenters/GetPaymentsPresenter.js';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly getPaymentsUseCase: GetPaymentsUseCase,
    private readonly getPaymentsPresenter: GetPaymentsPresenter,
  ) {}

  @ApiOkResponse({ type: GetPaymentsResponseDto })
  @Get()
  async getPayments(@Claims() claims: AuthClaim) {
    try {
      const result = await this.getPaymentsUseCase.execute({
        initiatorUserId: claims.sub,
      });

      return this.getPaymentsPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof PaymentActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

}
