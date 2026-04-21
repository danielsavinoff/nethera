import { Module } from '@nestjs/common';
import { AppController } from './controllers/AppController.js';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { AuthController } from './controllers/AuthController.js';
import { RoleController } from './controllers/RoleController.js';
import { PlanController } from './controllers/PlanController.js';
import { SubscriptionCheckoutController } from './controllers/SubscriptionCheckoutController.js';
import { UserController } from './controllers/UserController.js';
import { PersistenceModule } from '../../out/persistence/PersistenceModule.js';
import { GetCurrentUserPresenter } from './presenters/GetCurrentUserPresenter.js';
import { GetUsersPresenter } from './presenters/GetUsersPresenter.js';
import { GetUserRolesPresenter } from './presenters/GetUserRolesPresenter.js';
import { AddUserRolePresenter } from './presenters/AddUserRolePresenter.js';
import { DeleteUserRolePresenter } from './presenters/DeleteUserRolePresenter.js';
import { GetRolesPresenter } from './presenters/GetRolesPresenter.js';
import { CreatePlanPresenter } from './presenters/CreatePlanPresenter.js';
import { CreateSubscriptionCheckoutPresenter } from './presenters/CreateSubscriptionCheckoutPresenter.js';

@Module({
  controllers: [
    AppController,
    AuthController,
    RoleController,
    PlanController,
    SubscriptionCheckoutController,
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
    CreateSubscriptionCheckoutPresenter,
  ],
  imports: [UseCaseModule, PersistenceModule],
})
export class HttpModule {}
