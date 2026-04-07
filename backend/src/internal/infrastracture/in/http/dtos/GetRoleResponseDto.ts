import { ApiProperty } from '@nestjs/swagger';

export class GetRoleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  constructor(data: GetRoleResponseDto) {
    Object.assign(this, data);
  }
}
