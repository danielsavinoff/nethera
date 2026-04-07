import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserRoleResponseDto {
  @ApiProperty()
  roleId!: string;

  constructor(data: DeleteUserRoleResponseDto) {
    Object.assign(this, data);
  }
}
