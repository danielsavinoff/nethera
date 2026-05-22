import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RemnawaveVpnSubscriptionProvider } from './providers/RemnawaveVpnSubscriptionProvider.js';

@Module({
  imports: [HttpModule],
  providers: [RemnawaveVpnSubscriptionProvider],
  exports: [RemnawaveVpnSubscriptionProvider],
})
export class VpnModule {}
