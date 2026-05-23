import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RemnawaveVpnSubscriptionProvider } from './providers/RemnawaveVpnSubscriptionProvider.js';
import { RemnawaveVpnUsageProvider } from './providers/RemnawaveVpnUsageProvider.js';

@Module({
  imports: [HttpModule],
  providers: [
    RemnawaveVpnSubscriptionProvider,
    RemnawaveVpnUsageProvider,
  ],
  exports: [
    RemnawaveVpnSubscriptionProvider,
    RemnawaveVpnUsageProvider,
  ],
})
export class VpnModule {}
