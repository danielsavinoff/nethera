import { ApiProperty } from '@nestjs/swagger';

export class GetGroupResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(data: GetGroupResponseDto) {
    Object.assign(this, data);
  }
}
