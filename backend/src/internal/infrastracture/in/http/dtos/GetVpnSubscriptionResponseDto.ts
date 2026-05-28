import { ApiProperty } from '@nestjs/swagger';

export class GetVpnSubscriptionResponseDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  subscriptionUrl!: string;

  constructor(data: GetVpnSubscriptionResponseDto) {
    Object.assign(this, data);
  }
}
