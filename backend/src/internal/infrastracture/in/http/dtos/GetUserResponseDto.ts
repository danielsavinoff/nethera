import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  active!: boolean;

  @ApiProperty({
    type: [String],
  })
  departmentExternalIds!: string[];

  constructor(data: GetUserResponseDto) {
    Object.assign(this, data);
  }
}
