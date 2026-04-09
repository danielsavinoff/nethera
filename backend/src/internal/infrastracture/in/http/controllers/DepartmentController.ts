import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetDepartmentsUseCase } from '../../../../application/usecases/GetDepartmentsUseCase.js';
import { Claims } from '../decorators/Claims.js';
import { GetDepartmentsResponseDto } from '../dtos/GetDepartmentsResponseDto.js';
import { GetDepartmentsPresenter } from '../presenters/GetDepartmentsPresenter.js';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly getDepartmentsUseCase: GetDepartmentsUseCase,
    private readonly getDepartmentsPresenter: GetDepartmentsPresenter,
  ) {}

  @ApiOkResponse({ type: GetDepartmentsResponseDto })
  @Get()
  async handleGetAll(@Claims() claims: AuthClaim) {
    const result = await this.getDepartmentsUseCase.execute({
      tenantId: claims.tid,
    });

    return this.getDepartmentsPresenter.present(result);
  }
}
