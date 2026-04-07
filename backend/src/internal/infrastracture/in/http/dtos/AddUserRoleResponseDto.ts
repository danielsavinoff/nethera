import { ApiProperty } from '@nestjs/swagger';

export class AddUserRoleResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  roleId!: string;

  @ApiProperty()
  roleName!: string;

  constructor(data: AddUserRoleResponseDto) {
    Object.assign(this, data);
  }
}
