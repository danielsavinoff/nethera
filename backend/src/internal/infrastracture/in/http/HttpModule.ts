import { Module } from '@nestjs/common';
import { AppController } from './controllers/AppController.js';
import { BitrixController } from './controllers/BitrixController.js';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { AuthController } from './controllers/AuthController.js';
import { DepartmentController } from './controllers/DepartmentController.js';
import { RoleController } from './controllers/RoleController.js';
import { UserController } from './controllers/UserController.js';
import { BitrixModule } from '../../out/bitrix/BitrixModule.js';
import { PersistenceModule } from '../../out/persistence/PersistenceModule.js';
import { GetCurrentUserPresenter } from './presenters/GetCurrentUserPresenter.js';
import { GetUsersPresenter } from './presenters/GetUsersPresenter.js';
import { GetUserRolesPresenter } from './presenters/GetUserRolesPresenter.js';
import { AddUserRolePresenter } from './presenters/AddUserRolePresenter.js';
import { DeleteUserRolePresenter } from './presenters/DeleteUserRolePresenter.js';
import { GetDepartmentsPresenter } from './presenters/GetDepartmentsPresenter.js';
import { GetRolesPresenter } from './presenters/GetRolesPresenter.js';
import { TenantGuard } from './guards/TenantGuard.js';
import { EventGuard } from './guards/EventGuard.js';

@Module({
  controllers: [
    AppController,
    BitrixController,
    AuthController,
    DepartmentController,
    RoleController,
    UserController,
  ],
  providers: [
    GetDepartmentsPresenter,
    GetUsersPresenter,
    GetCurrentUserPresenter,
    GetUserRolesPresenter,
    AddUserRolePresenter,
    DeleteUserRolePresenter,
    GetRolesPresenter,
    TenantGuard,
    EventGuard,
  ],
  imports: [UseCaseModule, BitrixModule, PersistenceModule],
})
export class HttpModule {}
