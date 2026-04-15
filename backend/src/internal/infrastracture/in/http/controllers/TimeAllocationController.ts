import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetTimeAllocationsUseCase } from '../../../../application/usecases/GetTimeAllocationsUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { GetTimeAllocationsQueryDto } from '../dtos/GetTimeAllocationsQueryDto.js';
import { GetTimeAllocationsResponseDto } from '../dtos/GetTimeAllocationsResponseDto.js';
import { GetTimeAllocationsPresenter } from '../presenters/GetTimeAllocationsPresenter.js';

@Controller('time-allocations')
export class TimeAllocationController {
  constructor(
    private readonly getTimeAllocationsUseCase: GetTimeAllocationsUseCase,
    private readonly getTimeAllocationsPresenter: GetTimeAllocationsPresenter,
  ) {}

  @ApiOkResponse({ type: GetTimeAllocationsResponseDto })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'year',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'weekNumber',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'weekNumberFrom',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'weekNumberTo',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @Get()
  async handleGetAll(
    @Query() query: GetTimeAllocationsQueryDto,
    @Claims() claims: AuthClaim,
  ) {
    const result = await this.getTimeAllocationsUseCase.execute({
      tenantId: claims.tid,
      userId: query.userId,
      year: query.year,
      weekNumber: query.weekNumber,
      weekNumberFrom: query.weekNumberFrom,
      weekNumberTo: query.weekNumberTo,
      page: query.page,
      limit: query.limit,
    });

    return this.getTimeAllocationsPresenter.present(result);
  }
}
