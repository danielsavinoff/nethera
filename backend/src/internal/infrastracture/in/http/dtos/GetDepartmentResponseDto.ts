import { ApiProperty } from '@nestjs/swagger';

export class GetDepartmentResponseDto {
  @ApiProperty()
  externalId!: string;

  @ApiProperty({
    required: false,
  })
  parentExternalId?: string;

  @ApiProperty()
  name!: string;

  constructor(data: GetDepartmentResponseDto) {
    Object.assign(this, data);
  }
}
