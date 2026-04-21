import { ApiProperty } from '@nestjs/swagger';
import { CreatePlanFeatureTranslationResponseDto } from './CreatePlanFeatureTranslationResponseDto.js';

export class CreatePlanFeatureResponseDto {
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
    type: [CreatePlanFeatureTranslationResponseDto],
  })
  translations!: CreatePlanFeatureTranslationResponseDto[];

  constructor(data: CreatePlanFeatureResponseDto) {
    Object.assign(this, data);
  }
}
