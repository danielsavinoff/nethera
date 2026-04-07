import { Injectable } from '@nestjs/common';
import { AddUserRoleResult } from '../../../../application/usecases/AddUserRoleUseCase.js';
import { AddUserRoleResponseDto } from '../dtos/AddUserRoleResponseDto.js';

@Injectable()
export class AddUserRolePresenter {
  present(result: AddUserRoleResult): AddUserRoleResponseDto {
    return new AddUserRoleResponseDto({
      userId: result.userId,
      roleId: result.role.id,
      roleName: result.role.name,
    });
  }
}
