import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetDepartmentUsersUseCase } from '../../../../application/usecases/GetDepartmentUsersUseCase.js';
import { GetDepartmentsUseCase } from '../../../../application/usecases/GetDepartmentsUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { GetDepartmentUsersQueryDto } from '../dtos/GetDepartmentUsersQueryDto.js';
import { GetDepartmentUsersResponseDto } from '../dtos/GetDepartmentUsersResponseDto.js';
import { GetDepartmentsResponseDto } from '../dtos/GetDepartmentsResponseDto.js';
import { GetDepartmentUsersPresenter } from '../presenters/GetDepartmentUsersPresenter.js';
import { GetDepartmentsPresenter } from '../presenters/GetDepartmentsPresenter.js';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly getDepartmentsUseCase: GetDepartmentsUseCase,
    private readonly getDepartmentsPresenter: GetDepartmentsPresenter,
    private readonly getDepartmentUsersUseCase: GetDepartmentUsersUseCase,
    private readonly getDepartmentUsersPresenter: GetDepartmentUsersPresenter,
  ) {}

  @ApiOkResponse({ type: GetDepartmentsResponseDto })
  @Get()
  async handleGetAll(@Claims() claims: AuthClaim) {
    const result = await this.getDepartmentsUseCase.execute({
      tenantId: claims.tid,
    });

    return this.getDepartmentsPresenter.present(result);
  }

  @ApiOkResponse({ type: GetDepartmentUsersResponseDto })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
  })
  @Get('external/:externalId/users')
  async handleGetUsersByExternalId(
    @Param('externalId') externalId: string,
    @Query() query: GetDepartmentUsersQueryDto,
    @Claims() claims: AuthClaim,
  ) {
    const result = await this.getDepartmentUsersUseCase.execute({
      tenantId: claims.tid,
      departmentExternalId: externalId,
      active: query.active,
    });

    return this.getDepartmentUsersPresenter.present(result);
  }
}
