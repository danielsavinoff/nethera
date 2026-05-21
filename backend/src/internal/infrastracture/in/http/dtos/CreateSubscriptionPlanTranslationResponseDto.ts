import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionPlanTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(
    data: CreateSubscriptionPlanTranslationResponseDto,
  ) {
    Object.assign(this, data);
  }
}
