import { Module } from '@nestjs/common';
import { AppController } from './controllers/AppController.js';
import { BitrixController } from './controllers/BitrixController.js';
import { UseCaseModule } from '../../bootstrap/UseCaseModule.js';
import { AuthController } from './controllers/AuthController.js';
import { DepartmentController } from './controllers/DepartmentController.js';
import { RoleController } from './controllers/RoleController.js';
import { UserController } from './controllers/UserController.js';
import { TimeAllocationController } from './controllers/TimeAllocationController.js';
import { BitrixModule } from '../../out/bitrix/BitrixModule.js';
import { PersistenceModule } from '../../out/persistence/PersistenceModule.js';
import { GetCurrentUserPresenter } from './presenters/GetCurrentUserPresenter.js';
import { GetUsersPresenter } from './presenters/GetUsersPresenter.js';
import { GetUserRolesPresenter } from './presenters/GetUserRolesPresenter.js';
import { AddUserRolePresenter } from './presenters/AddUserRolePresenter.js';
import { DeleteUserRolePresenter } from './presenters/DeleteUserRolePresenter.js';
import { GetUserFavoritesPresenter } from './presenters/GetUserFavoritesPresenter.js';
import { AddUserFavoritesPresenter } from './presenters/AddUserFavoritesPresenter.js';
import { DeleteUserFavoritesPresenter } from './presenters/DeleteUserFavoritesPresenter.js';
import { GetDepartmentUsersPresenter } from './presenters/GetDepartmentUsersPresenter.js';
import { GetDepartmentsPresenter } from './presenters/GetDepartmentsPresenter.js';
import { GetRolesPresenter } from './presenters/GetRolesPresenter.js';
import { AddTimeAllocationPresenter } from './presenters/AddTimeAllocationPresenter.js';
import { GetTimeAllocationsPresenter } from './presenters/GetTimeAllocationsPresenter.js';
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
    TimeAllocationController,
  ],
  providers: [
    GetDepartmentUsersPresenter,
    GetDepartmentsPresenter,
    GetUsersPresenter,
    GetCurrentUserPresenter,
    GetUserRolesPresenter,
    GetUserFavoritesPresenter,
    AddUserRolePresenter,
    AddUserFavoritesPresenter,
    DeleteUserRolePresenter,
    DeleteUserFavoritesPresenter,
    GetRolesPresenter,
    AddTimeAllocationPresenter,
    GetTimeAllocationsPresenter,
    TenantGuard,
    EventGuard,
  ],
  imports: [UseCaseModule, BitrixModule, PersistenceModule],
})
export class HttpModule {}
