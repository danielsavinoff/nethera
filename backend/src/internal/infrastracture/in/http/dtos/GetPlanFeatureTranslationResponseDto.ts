import { ApiProperty } from '@nestjs/swagger';

export class GetPlanFeatureTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(data: GetPlanFeatureTranslationResponseDto) {
    Object.assign(this, data);
  }
}
