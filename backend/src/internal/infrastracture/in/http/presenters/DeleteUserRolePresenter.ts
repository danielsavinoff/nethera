import { Injectable } from '@nestjs/common';
import { DeleteUserRoleResult } from '../../../../application/usecases/DeleteUserRoleUseCase.js';
import { DeleteUserRoleResponseDto } from '../dtos/DeleteUserRoleResponseDto.js';

@Injectable()
export class DeleteUserRolePresenter {
  present(
    result: DeleteUserRoleResult,
  ): DeleteUserRoleResponseDto {
    return new DeleteUserRoleResponseDto({
      roleId: result.roleId,
    });
  }
}
