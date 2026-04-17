import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetGroupsUseCase } from '../../../../application/usecases/GetGroupsUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { GetGroupsQueryDto } from '../dtos/GetGroupsQueryDto.js';
import { GetGroupsResponseDto } from '../dtos/GetGroupsResponseDto.js';
import { GetGroupsPresenter } from '../presenters/GetGroupsPresenter.js';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly getGroupsUseCase: GetGroupsUseCase,
    private readonly getGroupsPresenter: GetGroupsPresenter,
  ) {}

  @ApiOkResponse({ type: GetGroupsResponseDto })
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
    @Query() query: GetGroupsQueryDto,
    @Claims() claims: AuthClaim,
  ) {
    const result = await this.getGroupsUseCase.execute({
      tenantId: claims.tid,
      page: query.page,
      limit: query.limit,
    });

    return this.getGroupsPresenter.present(result);
  }
}
