import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { CreatePlanUseCase } from '../../../../application/usecases/CreatePlanUseCase.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { Claims } from '../decorators/Claims.js';
import { CreatePlanRequestDto } from '../dtos/CreatePlanRequestDto.js';
import { CreatePlanResponseDto } from '../dtos/CreatePlanResponseDto.js';
import { CreatePlanPresenter } from '../presenters/CreatePlanPresenter.js';
import { PlanActionForbiddenException } from '../../../../domain/subscription/PlanActionForbiddenException.js';

@Controller('plans')
export class PlanController {
  constructor(
    private readonly createPlanUseCase: CreatePlanUseCase,
    private readonly createPlanPresenter: CreatePlanPresenter,
  ) {}

  @ApiOkResponse({ type: CreatePlanResponseDto })
  @Post()
  async handleCreatePlan(
    @Body() createPlanRequestDto: CreatePlanRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.createPlanUseCase.execute({
        initiatorUserId: claims.sub,
        code: createPlanRequestDto.code,
        priceAmount: createPlanRequestDto.priceAmount,
        priceCurrency: createPlanRequestDto.priceCurrency,
        billingInterval: createPlanRequestDto.billingInterval,
        billingIntervalCount:
          createPlanRequestDto.billingIntervalCount,
        trialDays: createPlanRequestDto.trialDays,
        active: createPlanRequestDto.active,
        translations: createPlanRequestDto.translations,
        features: createPlanRequestDto.features,
      });

      return this.createPlanPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof PlanActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
