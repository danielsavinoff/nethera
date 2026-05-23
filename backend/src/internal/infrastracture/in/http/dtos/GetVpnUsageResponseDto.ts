import { ApiProperty } from '@nestjs/swagger';

export class GetVpnUsageResponseDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'number',
    },
    example: {
      '2026-05-01': 42.5,
    },
  })
  usage!: Record<string, number>;

  constructor(data: GetVpnUsageResponseDto) {
    Object.assign(this, data);
  }
}
