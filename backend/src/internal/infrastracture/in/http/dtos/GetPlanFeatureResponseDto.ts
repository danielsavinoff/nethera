import { ApiProperty } from '@nestjs/swagger';
import { GetPlanFeatureTranslationResponseDto } from './GetPlanFeatureTranslationResponseDto.js';

export class GetPlanFeatureResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty({ required: false })
  value?: string;

  @ApiProperty()
  sortOrder!: number;

  @ApiProperty()
  active!: boolean;

  @ApiProperty({
    type: [GetPlanFeatureTranslationResponseDto],
  })
  translations!: GetPlanFeatureTranslationResponseDto[];

  constructor(data: GetPlanFeatureResponseDto) {
    Object.assign(this, data);
  }
}
