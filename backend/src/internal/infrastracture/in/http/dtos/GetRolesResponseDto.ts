import { ApiProperty } from '@nestjs/swagger';
import { GetRoleResponseDto } from './GetRoleResponseDto.js';

export class GetRolesResponseDto {
  @ApiProperty({
    type: [GetRoleResponseDto],
  })
  roles!: GetRoleResponseDto[];

  constructor(data: GetRolesResponseDto) {
    Object.assign(this, data);
  }
}
