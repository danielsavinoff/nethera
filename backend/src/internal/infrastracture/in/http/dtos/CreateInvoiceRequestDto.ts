import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { BillingProvider } from '../../../../domain/subscription/BillingProvider.js';
import { InvoiceLineType } from '../../../../domain/subscription/InvoiceLineType.js';

export class CreateInvoiceRequestDto {
  @ApiProperty({ enum: InvoiceLineType })
  @IsEnum(InvoiceLineType)
  type!: InvoiceLineType;

  @ApiProperty()
  @IsString()
  referenceId!: string;

  @ApiProperty({ enum: BillingProvider })
  @IsEnum(BillingProvider)
  provider!: BillingProvider;
}
