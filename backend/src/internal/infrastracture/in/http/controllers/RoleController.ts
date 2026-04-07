import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetRolesUseCase } from '../../../../application/usecases/GetRolesUseCase.js';
import { GetRolesResponseDto } from '../dtos/GetRolesResponseDto.js';
import { GetRolesPresenter } from '../presenters/GetRolesPresenter.js';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRolesPresenter: GetRolesPresenter,
  ) {}

  @ApiOkResponse({ type: GetRolesResponseDto })
  @Get()
  async handleGetRoles() {
    const result = await this.getRolesUseCase.execute();

    return this.getRolesPresenter.present(result);
  }
}
