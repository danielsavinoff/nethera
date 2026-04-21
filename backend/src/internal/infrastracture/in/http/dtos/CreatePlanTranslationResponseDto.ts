import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(data: CreatePlanTranslationResponseDto) {
    Object.assign(this, data);
  }
}
