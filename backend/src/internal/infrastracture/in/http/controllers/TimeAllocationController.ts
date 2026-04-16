import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { AddTimeAllocationUseCase } from '../../../../application/usecases/AddTimeAllocationUseCase.js';
import { GetTimeAllocationsUseCase } from '../../../../application/usecases/GetTimeAllocationsUseCase.js';
import { ExternalGroupNotFoundException } from '../../../../application/exceptions/ExternalGroupNotFoundException.js';
import { ExternalTaskNotFoundException } from '../../../../application/exceptions/ExternalTaskNotFoundException.js';
import { TenantTimeAllocationSmartProcessNotFoundException } from '../../../../application/exceptions/TenantTimeAllocationSmartProcessNotFoundException.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { TimeAllocationActionForbiddenException } from '../../../../domain/time-allocation/TimeAllocationActionForbiddenException.js';
import { Claims } from '../decorators/Claims.js';
import { AddTimeAllocationRequestDto } from '../dtos/AddTimeAllocationRequestDto.js';
import { AddTimeAllocationResponseDto } from '../dtos/AddTimeAllocationResponseDto.js';
import { GetTimeAllocationsQueryDto } from '../dtos/GetTimeAllocationsQueryDto.js';
import { GetTimeAllocationsResponseDto } from '../dtos/GetTimeAllocationsResponseDto.js';
import { AddTimeAllocationPresenter } from '../presenters/AddTimeAllocationPresenter.js';
import { GetTimeAllocationsPresenter } from '../presenters/GetTimeAllocationsPresenter.js';

@Controller('time-allocations')
export class TimeAllocationController {
  constructor(
    private readonly addTimeAllocationUseCase: AddTimeAllocationUseCase,
    private readonly addTimeAllocationPresenter: AddTimeAllocationPresenter,
    private readonly getTimeAllocationsUseCase: GetTimeAllocationsUseCase,
    private readonly getTimeAllocationsPresenter: GetTimeAllocationsPresenter,
  ) {}

  @ApiOkResponse({ type: AddTimeAllocationResponseDto })
  @Post()
  async handleAdd(
    @Body()
    addTimeAllocationRequestDto: AddTimeAllocationRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.addTimeAllocationUseCase.execute(
        {
          initiatorUserId: claims.sub,
          tenantId: claims.tid,
          groupId: addTimeAllocationRequestDto.groupId,
          taskId: addTimeAllocationRequestDto.taskId,
          hours: addTimeAllocationRequestDto.hours,
          isApproved: addTimeAllocationRequestDto.isApproved,
          weekNumber: addTimeAllocationRequestDto.weekNumber,
          year: addTimeAllocationRequestDto.year,
          assigneeId: addTimeAllocationRequestDto.assigneeId,
          assignerId: addTimeAllocationRequestDto.assignerId,
        },
      );

      return this.addTimeAllocationPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof ExternalTaskNotFoundException) {
        throw new NotFoundException('Task does not exist.');
      }

      if (error instanceof ExternalGroupNotFoundException) {
        throw new NotFoundException('Group does not exist.');
      }

      if (
        error instanceof
        TenantTimeAllocationSmartProcessNotFoundException
      ) {
        throw new NotFoundException(
          'Time allocation smart process does not exist.',
        );
      }

      if (
        error instanceof TimeAllocationActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

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
    try {
      const result =
        await this.getTimeAllocationsUseCase.execute({
          initiatorUserId: claims.sub,
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
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (
        error instanceof TimeAllocationActionForbiddenException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
