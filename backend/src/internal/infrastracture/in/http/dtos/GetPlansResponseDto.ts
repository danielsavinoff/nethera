import { ApiProperty } from '@nestjs/swagger';
import { GetPlanResponseDto } from './GetPlanResponseDto.js';

export class GetPlansResponseDto {
  @ApiProperty({
    type: [GetPlanResponseDto],
  })
  plans!: GetPlanResponseDto[];

  constructor(data: GetPlansResponseDto) {
    Object.assign(this, data);
  }
}
