import { Module } from '@nestjs/common';
import { AppController } from './controllers/AppController.js';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { AuthController } from './controllers/AuthController.js';
import { RoleController } from './controllers/RoleController.js';
import { SubscriptionPlanController } from './controllers/SubscriptionPlanController.js';
import { SubscriptionController } from './controllers/SubscriptionController.js';
import { BillingController } from './controllers/BillingController.js';
import { VpnSubscriptionController } from './controllers/VpnSubscriptionController.js';
import { NowPaymentsWebhookController } from './controllers/NowPaymentsWebhookController.js';
import { UserController } from './controllers/UserController.js';
import { NowPaymentsGuard } from './guards/NowPaymentsGuard.js';
import { PersistenceModule } from '../../out/persistence/PersistenceModule.js';
import { GetCurrentUserPresenter } from './presenters/GetCurrentUserPresenter.js';
import { GetUsersPresenter } from './presenters/GetUsersPresenter.js';
import { UpdateCurrentUserLocalePresenter } from './presenters/UpdateCurrentUserLocalePresenter.js';
import { UpdateCurrentUserCurrencyPresenter } from './presenters/UpdateCurrentUserCurrencyPresenter.js';
import { GetUserRolesPresenter } from './presenters/GetUserRolesPresenter.js';
import { DeleteAccountPresenter } from './presenters/DeleteAccountPresenter.js';
import { AddUserRolePresenter } from './presenters/AddUserRolePresenter.js';
import { DeleteUserRolePresenter } from './presenters/DeleteUserRolePresenter.js';
import { GetRolesPresenter } from './presenters/GetRolesPresenter.js';
import { CreateSubscriptionPlanPresenter } from './presenters/CreateSubscriptionPlanPresenter.js';
import { GetSubscriptionPlanPresenter } from './presenters/GetSubscriptionPlanPresenter.js';
import { GetSubscriptionPlansPresenter } from './presenters/GetSubscriptionPlansPresenter.js';
import { GetSubscriptionPresenter } from './presenters/GetSubscriptionPresenter.js';
import { GetSubscriptionsPresenter } from './presenters/GetSubscriptionsPresenter.js';
import { CancelSubscriptionPresenter } from './presenters/CancelSubscriptionPresenter.js';
import { ExtendSubscriptionPresenter } from './presenters/ExtendSubscriptionPresenter.js';
import { GetInvoicesPresenter } from './presenters/GetInvoicesPresenter.js';
import { GetInvoicePresenter } from './presenters/GetInvoicePresenter.js';
import { GetInvoiceLinesPresenter } from './presenters/GetInvoiceLinesPresenter.js';
import { CreateInvoicePresenter } from './presenters/CreateInvoicePresenter.js';
import { GetBillingProvidersPresenter } from './presenters/GetBillingProvidersPresenter.js';
import { GetSupportedCurrenciesPresenter } from './presenters/GetSupportedCurrenciesPresenter.js';
import { GetVpnSubscriptionPresenter } from './presenters/GetVpnSubscriptionPresenter.js';
import { GetVpnUsagePresenter } from './presenters/GetVpnUsagePresenter.js';
import { NowPaymentsPaymentStatusMapper } from '../../shared/payment/mappers/NowPaymentsPaymentStatusMapper.js';

@Module({
  controllers: [
    AppController,
    AuthController,
    RoleController,
    SubscriptionPlanController,
    SubscriptionController,
    BillingController,
    VpnSubscriptionController,
    NowPaymentsWebhookController,
    UserController,
  ],
  providers: [
    GetUsersPresenter,
    GetCurrentUserPresenter,
    UpdateCurrentUserLocalePresenter,
    UpdateCurrentUserCurrencyPresenter,
    GetUserRolesPresenter,
    DeleteAccountPresenter,
    AddUserRolePresenter,
    DeleteUserRolePresenter,
    GetRolesPresenter,
    CreateSubscriptionPlanPresenter,
    GetSubscriptionPlanPresenter,
    GetSubscriptionPlansPresenter,
    GetSubscriptionPresenter,
    GetSubscriptionsPresenter,
    CancelSubscriptionPresenter,
    ExtendSubscriptionPresenter,
    GetInvoicePresenter,
    GetInvoicesPresenter,
    GetInvoiceLinesPresenter,
    CreateInvoicePresenter,
    GetBillingProvidersPresenter,
    GetSupportedCurrenciesPresenter,
    GetVpnSubscriptionPresenter,
    GetVpnUsagePresenter,
    NowPaymentsPaymentStatusMapper,
    NowPaymentsGuard,
  ],
  imports: [UseCaseModule, PersistenceModule],
})
export class HttpModule {}
