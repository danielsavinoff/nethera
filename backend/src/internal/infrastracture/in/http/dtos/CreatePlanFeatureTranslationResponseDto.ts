import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanFeatureTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(data: CreatePlanFeatureTranslationResponseDto) {
    Object.assign(this, data);
  }
}
