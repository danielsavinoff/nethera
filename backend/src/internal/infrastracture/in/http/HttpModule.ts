import { Module } from '@nestjs/common';
import { AppController } from './controllers/AppController.js';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { AuthController } from './controllers/AuthController.js';
import { RoleController } from './controllers/RoleController.js';
import { SubscriptionPlanController } from './controllers/SubscriptionPlanController.js';
import { SubscriptionController } from './controllers/SubscriptionController.js';
import { InvoiceController } from './controllers/InvoiceController.js';
import { NowPaymentsWebhookController } from './controllers/NowPaymentsWebhookController.js';
import { PaymentController } from './controllers/PaymentController.js';
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
import { GetPaymentsPresenter } from './presenters/GetPaymentsPresenter.js';
import { CreateInvoicePresenter } from './presenters/CreateInvoicePresenter.js';
import { NowPaymentsPaymentStatusMapper } from '../../shared/payment/mappers/NowPaymentsPaymentStatusMapper.js';

@Module({
  controllers: [
    AppController,
    AuthController,
    RoleController,
    SubscriptionPlanController,
    SubscriptionController,
    InvoiceController,
    NowPaymentsWebhookController,
    PaymentController,
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
    GetPaymentsPresenter,
    CreateInvoicePresenter,
    NowPaymentsPaymentStatusMapper,
  ],
  imports: [UseCaseModule, PersistenceModule],
})
export class HttpModule {}
