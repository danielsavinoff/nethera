import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionPlanFeatureTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  locale!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(
    data: GetSubscriptionPlanFeatureTranslationResponseDto,
  ) {
    Object.assign(this, data);
  }
}
