import { Module } from '@nestjs/common';
import { AppController } from './controllers/AppController.js';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { AuthController } from './controllers/AuthController.js';
import { RoleController } from './controllers/RoleController.js';
import { PlanController } from './controllers/PlanController.js';
import { SubscriptionController } from './controllers/SubscriptionController.js';
import { SubscriptionInvoiceController } from './controllers/SubscriptionInvoiceController.js';
import { UserController } from './controllers/UserController.js';
import { PersistenceModule } from '../../out/persistence/PersistenceModule.js';
import { GetCurrentUserPresenter } from './presenters/GetCurrentUserPresenter.js';
import { GetUsersPresenter } from './presenters/GetUsersPresenter.js';
import { GetUserRolesPresenter } from './presenters/GetUserRolesPresenter.js';
import { AddUserRolePresenter } from './presenters/AddUserRolePresenter.js';
import { DeleteUserRolePresenter } from './presenters/DeleteUserRolePresenter.js';
import { GetRolesPresenter } from './presenters/GetRolesPresenter.js';
import { CreatePlanPresenter } from './presenters/CreatePlanPresenter.js';
import { GetPlanPresenter } from './presenters/GetPlanPresenter.js';
import { GetPlansPresenter } from './presenters/GetPlansPresenter.js';
import { GetSubscriptionPresenter } from './presenters/GetSubscriptionPresenter.js';
import { GetSubscriptionsPresenter } from './presenters/GetSubscriptionsPresenter.js';
import { GetSubscriptionInvoicesPresenter } from './presenters/GetSubscriptionInvoicesPresenter.js';
import { CreateSubscriptionInvoicePresenter } from './presenters/CreateSubscriptionInvoicePresenter.js';

@Module({
  controllers: [
    AppController,
    AuthController,
    RoleController,
    PlanController,
    SubscriptionController,
    SubscriptionInvoiceController,
    UserController,
  ],
  providers: [
    GetUsersPresenter,
    GetCurrentUserPresenter,
    GetUserRolesPresenter,
    AddUserRolePresenter,
    DeleteUserRolePresenter,
    GetRolesPresenter,
    CreatePlanPresenter,
    GetPlanPresenter,
    GetPlansPresenter,
    GetSubscriptionPresenter,
    GetSubscriptionsPresenter,
    GetSubscriptionInvoicesPresenter,
    CreateSubscriptionInvoicePresenter,
  ],
  imports: [UseCaseModule, PersistenceModule],
})
export class HttpModule {}
