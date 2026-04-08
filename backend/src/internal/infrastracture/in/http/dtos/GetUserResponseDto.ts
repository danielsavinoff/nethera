import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  active!: boolean;

  constructor(data: GetUserResponseDto) {
    Object.assign(this, data);
  }
}
