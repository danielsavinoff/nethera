import { Module } from '@nestjs/common';
import { AppController } from './controllers/AppController.js';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { AuthController } from './controllers/AuthController.js';
import { RoleController } from './controllers/RoleController.js';
import { SubscriptionPlanController } from './controllers/SubscriptionPlanController.js';
import { SubscriptionController } from './controllers/SubscriptionController.js';
import { InvoiceController } from './controllers/InvoiceController.js';
import { VpnSubscriptionController } from './controllers/VpnSubscriptionController.js';
import { NowPaymentsWebhookController } from './controllers/NowPaymentsWebhookController.js';
import { UserController } from './controllers/UserController.js';
import { PersistenceModule } from '../../out/persistence/PersistenceModule.js';
import { GetCurrentUserPresenter } from './presenters/GetCurrentUserPresenter.js';
import { GetUsersPresenter } from './presenters/GetUsersPresenter.js';
import { GetUserRolesPresenter } from './presenters/GetUserRolesPresenter.js';
import { AddUserRolePresenter } from './presenters/AddUserRolePresenter.js';
import { DeleteUserRolePresenter } from './presenters/DeleteUserRolePresenter.js';
import { GetRolesPresenter } from './presenters/GetRolesPresenter.js';
import { CreateSubscriptionPlanPresenter } from './presenters/CreateSubscriptionPlanPresenter.js';
import { GetSubscriptionPlanPresenter } from './presenters/GetSubscriptionPlanPresenter.js';
import { GetSubscriptionPlansPresenter } from './presenters/GetSubscriptionPlansPresenter.js';
import { GetSubscriptionPresenter } from './presenters/GetSubscriptionPresenter.js';
import { GetSubscriptionsPresenter } from './presenters/GetSubscriptionsPresenter.js';
import { CancelSubscriptionPresenter } from './presenters/CancelSubscriptionPresenter.js';
import { GetInvoicesPresenter } from './presenters/GetInvoicesPresenter.js';
import { CreateInvoicePresenter } from './presenters/CreateInvoicePresenter.js';
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
    InvoiceController,
    VpnSubscriptionController,
    NowPaymentsWebhookController,
    UserController,
  ],
  providers: [
    GetUsersPresenter,
    GetCurrentUserPresenter,
    GetUserRolesPresenter,
    AddUserRolePresenter,
    DeleteUserRolePresenter,
    GetRolesPresenter,
    CreateSubscriptionPlanPresenter,
    GetSubscriptionPlanPresenter,
    GetSubscriptionPlansPresenter,
    GetSubscriptionPresenter,
    GetSubscriptionsPresenter,
    CancelSubscriptionPresenter,
    GetInvoicesPresenter,
    CreateInvoicePresenter,
    GetVpnSubscriptionPresenter,
    GetVpnUsagePresenter,
    NowPaymentsPaymentStatusMapper,
  ],
  imports: [UseCaseModule, PersistenceModule],
})
export class HttpModule {}
