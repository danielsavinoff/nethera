import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BillingProvider } from '../../../../domain/subscription/BillingProvider.js';

export class ExtendSubscriptionRequestDto {
  @ApiProperty({ enum: BillingProvider })
  @IsEnum(BillingProvider)
  provider!: BillingProvider;
}
