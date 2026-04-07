import { ApiProperty } from '@nestjs/swagger';
import { GetUserRoleResponseDto } from './GetUserRoleResponseDto.js';

export class GetUserRolesResponseDto {
  @ApiProperty({
    type: [GetUserRoleResponseDto],
  })
  roles!: GetUserRoleResponseDto[];

  constructor(data: GetUserRolesResponseDto) {
    Object.assign(this, data);
  }
}
