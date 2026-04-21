import { ApiProperty } from '@nestjs/swagger';
import { GetSubscriptionResponseDto } from './GetSubscriptionResponseDto.js';

export class GetSubscriptionsResponseDto {
  @ApiProperty({
    type: [GetSubscriptionResponseDto],
  })
  subscriptions!: GetSubscriptionResponseDto[];

  constructor(data: GetSubscriptionsResponseDto) {
    Object.assign(this, data);
  }
}
