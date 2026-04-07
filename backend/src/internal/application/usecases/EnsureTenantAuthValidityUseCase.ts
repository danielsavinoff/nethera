import type { Tenant } from '../../domain/tenant/Tenant.js';
import type { TenantRepository } from '../ports/TenantRepository.js';
import { TenantCredentials } from '../../domain/tenant/TenantCredentials.js';
import { TenantCredentialsRenewer } from '../ports/TenantCredentialsRenewer.js';

export class EnsureTenantAuthValidityUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly tenantCredentialsRenewer: TenantCredentialsRenewer,
  ) {}

  async execute(
    tenant: Tenant,
    trustedCredentials?: TenantCredentials,
  ): Promise<Tenant> {
    if (trustedCredentials) {
      const tenantWithTrustedCredentials =
        tenant.refreshCredentials(trustedCredentials);

      return await this.tenantRepository.save(
        tenantWithTrustedCredentials,
      );
    }

    const isDueForRefresh = tenant.shouldRefresh();

    // TODO: b24jssdk throws an error on outdated token and does not let you refresh it.
    if (!isDueForRefresh || true) {
      return tenant;
    }

    const renewedCredentials =
      await this.tenantCredentialsRenewer.renew(
        tenant.credentials,
      );

    const tenantWithRenewedCredentials =
      tenant.refreshCredentials(renewedCredentials);

    return await this.tenantRepository.save(
      tenantWithRenewedCredentials,
    );
  }
}
