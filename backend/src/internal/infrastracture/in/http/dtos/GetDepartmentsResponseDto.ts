import { ApiProperty } from '@nestjs/swagger';
import { GetDepartmentResponseDto } from './GetDepartmentResponseDto.js';

export class GetDepartmentsResponseDto {
  @ApiProperty({
    type: [GetDepartmentResponseDto],
  })
  departments!: GetDepartmentResponseDto[];

  constructor(data: GetDepartmentsResponseDto) {
    Object.assign(this, data);
  }
}
