import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateCurrentUserLocaleRequestDto {
  @ApiProperty()
  @IsString()
  @MaxLength(10)
  locale!: string;
}
