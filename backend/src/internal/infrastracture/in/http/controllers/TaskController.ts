import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetTasksUseCase } from '../../../../application/usecases/GetTasksUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { GetTasksQueryDto } from '../dtos/GetTasksQueryDto.js';
import { GetTasksResponseDto } from '../dtos/GetTasksResponseDto.js';
import { GetTasksPresenter } from '../presenters/GetTasksPresenter.js';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly getTasksPresenter: GetTasksPresenter,
  ) {}

  @ApiOkResponse({ type: GetTasksResponseDto })
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
    @Query() query: GetTasksQueryDto,
    @Claims() claims: AuthClaim,
  ) {
    const result = await this.getTasksUseCase.execute({
      tenantId: claims.tid,
      page: query.page,
      limit: query.limit,
    });

    return this.getTasksPresenter.present(result);
  }
}
