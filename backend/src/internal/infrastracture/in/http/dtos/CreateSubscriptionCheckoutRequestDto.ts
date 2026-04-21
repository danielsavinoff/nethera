import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubscriptionCheckoutRequestDto {
  @ApiProperty()
  @IsString()
  planId!: string;

  @ApiProperty()
  @IsString()
  provider!: string;
}
