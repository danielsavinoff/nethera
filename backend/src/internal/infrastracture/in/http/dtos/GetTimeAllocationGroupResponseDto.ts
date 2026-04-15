import { ApiProperty } from '@nestjs/swagger';

export class GetTimeAllocationGroupResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  constructor(data: GetTimeAllocationGroupResponseDto) {
    Object.assign(this, data);
  }
}
