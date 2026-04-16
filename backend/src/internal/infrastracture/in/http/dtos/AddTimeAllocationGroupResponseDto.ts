import { ApiProperty } from '@nestjs/swagger';

export class AddTimeAllocationGroupResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  externalId!: string;

  @ApiProperty()
  name!: string;

  constructor(data: AddTimeAllocationGroupResponseDto) {
    Object.assign(this, data);
  }
}
