import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class HandleInstallationRequestDto {
  @ApiProperty()
  @IsString()
  accessToken!: string;

  @ApiProperty()
  @IsString()
  refreshToken!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  expires!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  expiresIn!: number;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/^https?:\/\//, '')
      : value,
  )
  domain!: string;

  @ApiProperty()
  @IsString()
  memberId!: string;
}
