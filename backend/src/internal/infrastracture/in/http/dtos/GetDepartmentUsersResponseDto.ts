import { ApiProperty } from '@nestjs/swagger';
import { GetUserResponseDto } from './GetUserResponseDto.js';

export class GetDepartmentUsersResponseDto {
  @ApiProperty({
    type: [GetUserResponseDto],
  })
  users!: GetUserResponseDto[];

  constructor(data: GetDepartmentUsersResponseDto) {
    Object.assign(this, data);
  }
}
