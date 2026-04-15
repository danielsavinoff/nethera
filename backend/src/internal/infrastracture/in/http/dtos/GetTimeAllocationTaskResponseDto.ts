import { ApiProperty } from '@nestjs/swagger';

export class GetTimeAllocationTaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  groupId?: string;

  constructor(data: GetTimeAllocationTaskResponseDto) {
    Object.assign(this, data);
  }
}
