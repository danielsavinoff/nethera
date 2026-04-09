import { Injectable } from '@nestjs/common';
import { GetDepartmentsResult } from '../../../../application/usecases/GetDepartmentsUseCase.js';
import { GetDepartmentResponseDto } from '../dtos/GetDepartmentResponseDto.js';
import { GetDepartmentsResponseDto } from '../dtos/GetDepartmentsResponseDto.js';

@Injectable()
export class GetDepartmentsPresenter {
  present(
    result: GetDepartmentsResult,
  ): GetDepartmentsResponseDto {
    return new GetDepartmentsResponseDto({
      departments: result.departments.map(
        (department) =>
          new GetDepartmentResponseDto({
            externalId: department.id,
            parentExternalId: department.parentId,
            name: department.name,
          }),
      ),
    });
  }
}
