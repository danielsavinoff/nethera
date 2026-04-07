import { ApiProperty } from '@nestjs/swagger';

export class GetUserRoleResponseDto {
  @ApiProperty()
  roleId!: string;

  @ApiProperty()
  roleName!: string;

  constructor(data: GetUserRoleResponseDto) {
    Object.assign(this, data);
  }
}
