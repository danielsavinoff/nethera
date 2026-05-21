import { ApiProperty } from '@nestjs/swagger';

export class GetSubscriptionPlanTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(data: GetSubscriptionPlanTranslationResponseDto) {
    Object.assign(this, data);
  }
}
