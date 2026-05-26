import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Claims } from '../decorators/Claims.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetUsersUseCase } from '../../../../application/usecases/GetUsersUseCase.js';
import { GetCurrentUserUseCase } from '../../../../application/usecases/GetCurrentUserUseCase.js';
import { DeleteAccountUseCase } from '../../../../application/usecases/DeleteAccountUseCase.js';
import { UpdateCurrentUserLocaleUseCase } from '../../../../application/usecases/UpdateCurrentUserLocaleUseCase.js';
import { UpdateCurrentUserCurrencyUseCase } from '../../../../application/usecases/UpdateCurrentUserCurrencyUseCase.js';
import { GetUsersQueryDto } from '../dtos/GetUsersQueryDto.js';
import { GetUsersResponseDto } from '../dtos/GetUsersResponseDto.js';
import { GetCurrentUserResponseDto } from '../dtos/GetCurrentUserResponseDto.js';
import { DeleteAccountResponseDto } from '../dtos/DeleteAccountResponseDto.js';
import { UpdateCurrentUserLocaleRequestDto } from '../dtos/UpdateCurrentUserLocaleRequestDto.js';
import { UpdateCurrentUserLocaleResponseDto } from '../dtos/UpdateCurrentUserLocaleResponseDto.js';
import { UpdateCurrentUserCurrencyRequestDto } from '../dtos/UpdateCurrentUserCurrencyRequestDto.js';
import { UpdateCurrentUserCurrencyResponseDto } from '../dtos/UpdateCurrentUserCurrencyResponseDto.js';
import { GetUsersPresenter } from '../presenters/GetUsersPresenter.js';
import { GetCurrentUserPresenter } from '../presenters/GetCurrentUserPresenter.js';
import { DeleteAccountPresenter } from '../presenters/DeleteAccountPresenter.js';
import { UpdateCurrentUserLocalePresenter } from '../presenters/UpdateCurrentUserLocalePresenter.js';
import { UpdateCurrentUserCurrencyPresenter } from '../presenters/UpdateCurrentUserCurrencyPresenter.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { GetUserRolesUseCase } from '../../../../application/usecases/GetUserRolesUseCase.js';
import { GetUserRolesResponseDto } from '../dtos/GetUserRolesResponseDto.js';
import { GetUserRolesPresenter } from '../presenters/GetUserRolesPresenter.js';
import { AddUserRoleUseCase } from '../../../../application/usecases/AddUserRoleUseCase.js';
import { AddUserRoleRequestDto } from '../dtos/AddUserRoleRequestDto.js';
import { AddUserRoleResponseDto } from '../dtos/AddUserRoleResponseDto.js';
import { AddUserRolePresenter } from '../presenters/AddUserRolePresenter.js';
import { DeleteUserRoleUseCase } from '../../../../application/usecases/DeleteUserRoleUseCase.js';
import { DeleteUserRolePresenter } from '../presenters/DeleteUserRolePresenter.js';
import { DeleteUserRoleResponseDto } from '../dtos/DeleteUserRoleResponseDto.js';
import { RoleNotFoundException } from '../../../../application/exceptions/RoleNotFoundException.js';
import { UserRoleAssignmentNotFoundException } from '../../../../application/exceptions/UserRoleAssignmentNotFoundException.js';
import { RoleActionForbiddenException } from '../../../../domain/authorization/RoleActionForbiddenException.js';
import { UserActionForbiddenException } from '../../../../domain/user/UserActionForbiddenException.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUsersPresenter: GetUsersPresenter,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly getCurrentUserPresenter: GetCurrentUserPresenter,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly deleteAccountPresenter: DeleteAccountPresenter,
    private readonly updateCurrentUserLocaleUseCase: UpdateCurrentUserLocaleUseCase,
    private readonly updateCurrentUserLocalePresenter: UpdateCurrentUserLocalePresenter,
    private readonly updateCurrentUserCurrencyUseCase: UpdateCurrentUserCurrencyUseCase,
    private readonly updateCurrentUserCurrencyPresenter: UpdateCurrentUserCurrencyPresenter,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
    private readonly getUserRolesPresenter: GetUserRolesPresenter,
    private readonly addUserRoleUseCase: AddUserRoleUseCase,
    private readonly addUserRolePresenter: AddUserRolePresenter,
    private readonly deleteUserRoleUseCase: DeleteUserRoleUseCase,
    private readonly deleteUserRolePresenter: DeleteUserRolePresenter,
  ) {}

  @ApiOkResponse({ type: GetUsersResponseDto })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @Get()
  async handleGetUsers(
    @Query() query: GetUsersQueryDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.getUsersUseCase.execute({
        initiatorUserId: claims.sub,
        isDeleted: query.isDeleted,
        q: query.q,
        page: query.page,
        limit: query.limit,
      });

      return this.getUsersPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof UserActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetCurrentUserResponseDto })
  @Get('me')
  async handleGetMe(@Claims() claims: AuthClaim) {
    const result = await this.getCurrentUserUseCase.execute({
      userId: claims.sub,
    });

    return this.getCurrentUserPresenter.present(result);
  }

  @ApiOkResponse({ type: UpdateCurrentUserLocaleResponseDto })
  @Patch('me/locale')
  async handleUpdateMeLocale(
    @Body()
    updateCurrentUserLocaleRequestDto: UpdateCurrentUserLocaleRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.updateCurrentUserLocaleUseCase.execute({
          userId: claims.sub,
          locale: updateCurrentUserLocaleRequestDto.locale,
        });

      return this.updateCurrentUserLocalePresenter.present(
        result,
      );
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof UserActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: UpdateCurrentUserCurrencyResponseDto })
  @Patch('me/currency')
  async handleUpdateMeCurrency(
    @Body()
    updateCurrentUserCurrencyRequestDto: UpdateCurrentUserCurrencyRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.updateCurrentUserCurrencyUseCase.execute({
          userId: claims.sub,
          preferredCurrencyCode:
            updateCurrentUserCurrencyRequestDto.preferredCurrencyCode.toUpperCase(),
        });

      return this.updateCurrentUserCurrencyPresenter.present(
        result,
      );
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof UserActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: DeleteAccountResponseDto })
  @Delete('me')
  async handleDeleteMe(@Claims() claims: AuthClaim) {
    try {
      const result = await this.deleteAccountUseCase.execute({
        initiatorUserId: claims.sub,
        targetUserId: claims.sub,
      });

      return this.deleteAccountPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof UserActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: GetUserRolesResponseDto })
  @Get(':id/roles')
  async handleGetRoles(
    @Param('id') userId: string,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.getUserRolesUseCase.execute({
        initiatorUserId: claims.sub,
        userId: userId,
      });

      return this.getUserRolesPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof RoleActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: AddUserRoleResponseDto })
  @Post(':id/roles')
  async handleAddRole(
    @Param('id') userId: string,
    @Body() addUserRoleRequestDto: AddUserRoleRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.addUserRoleUseCase.execute({
        initiatorUserId: claims.sub,
        userId: userId,
        roleId: addUserRoleRequestDto.roleId,
      });

      return this.addUserRolePresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof RoleNotFoundException) {
        throw new NotFoundException('Role does not exist.');
      }

      if (error instanceof RoleActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: DeleteUserRoleResponseDto })
  @Delete(':id/roles/:roleId')
  async handleDeleteRole(
    @Param('id') userId: string,
    @Param('roleId') roleId: string,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.deleteUserRoleUseCase.execute({
        initiatorUserId: claims.sub,
        userId: userId,
        roleId: roleId,
      });

      return this.deleteUserRolePresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof RoleNotFoundException) {
        throw new NotFoundException('Role does not exist.');
      }

      if (error instanceof UserRoleAssignmentNotFoundException) {
        throw new NotFoundException(
          'User role assignment does not exist.',
        );
      }

      if (error instanceof RoleActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
