import { ApiProperty } from '@nestjs/swagger';

export class GetVpnSubscriptionResponseDto {
  @ApiProperty()
  subscriptionUrl!: string;

  constructor(data: GetVpnSubscriptionResponseDto) {
    Object.assign(this, data);
  }
}
