import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty()
  isDeleted!: boolean;

  constructor(data: GetUserResponseDto) {
    Object.assign(this, data);
  }
}
