import { ApiProperty } from '@nestjs/swagger';

export class GetPlanTranslationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  language!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  constructor(data: GetPlanTranslationResponseDto) {
    Object.assign(this, data);
  }
}
