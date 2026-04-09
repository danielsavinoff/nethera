import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Claims } from '../decorators/Claims.js';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';
import { GetUsersUseCase } from '../../../../application/usecases/GetUsersUseCase.js';
import { GetCurrentUserUseCase } from '../../../../application/usecases/GetCurrentUserUseCase.js';
import { GetUsersQueryDto } from '../dtos/GetUsersQueryDto.js';
import { GetUsersResponseDto } from '../dtos/GetUsersResponseDto.js';
import { GetCurrentUserResponseDto } from '../dtos/GetCurrentUserResponseDto.js';
import { GetUsersPresenter } from '../presenters/GetUsersPresenter.js';
import { GetCurrentUserPresenter } from '../presenters/GetCurrentUserPresenter.js';
import { UserNotFoundException } from '../../../../application/exceptions/UserNotFoundException.js';
import { GetUserRolesUseCase } from '../../../../application/usecases/GetUserRolesUseCase.js';
import { GetUserRolesResponseDto } from '../dtos/GetUserRolesResponseDto.js';
import { GetUserRolesPresenter } from '../presenters/GetUserRolesPresenter.js';
import { AddUserRoleUseCase } from '../../../../application/usecases/AddUserRoleUseCase.js';
import { GetUserFavoritesUseCase } from '../../../../application/usecases/GetUserFavoritesUseCase.js';
import { AddUserFavoritesUseCase } from '../../../../application/usecases/AddUserFavoritesUseCase.js';
import { DeleteUserFavoritesUseCase } from '../../../../application/usecases/DeleteUserFavoritesUseCase.js';
import { AddUserRoleRequestDto } from '../dtos/AddUserRoleRequestDto.js';
import { AddUserRoleResponseDto } from '../dtos/AddUserRoleResponseDto.js';
import { AddUserRolePresenter } from '../presenters/AddUserRolePresenter.js';
import { AddUserFavoritesRequestDto } from '../dtos/AddUserFavoritesRequestDto.js';
import { AddUserFavoritesResponseDto } from '../dtos/AddUserFavoritesResponseDto.js';
import { GetUserFavoritesResponseDto } from '../dtos/GetUserFavoritesResponseDto.js';
import { DeleteUserFavoritesResponseDto } from '../dtos/DeleteUserFavoritesResponseDto.js';
import { DeleteUserRoleUseCase } from '../../../../application/usecases/DeleteUserRoleUseCase.js';
import { DeleteUserRolePresenter } from '../presenters/DeleteUserRolePresenter.js';
import { DeleteUserRoleResponseDto } from '../dtos/DeleteUserRoleResponseDto.js';
import { RoleNotFoundException } from '../../../../application/exceptions/RoleNotFoundException.js';
import { UserRoleAssignmentNotFoundException } from '../../../../application/exceptions/UserRoleAssignmentNotFoundException.js';
import { RoleActionForbiddenException } from '../../../../domain/authorization/RoleActionForbiddenException.js';
import { UserFavoriteNotFoundException } from '../../../../application/exceptions/UserFavoriteNotFoundException.js';
import { UserFavoriteActionForbiddenException } from '../../../../domain/user/UserFavoriteActionForbiddenException.js';
import { GetUserFavoritesPresenter } from '../presenters/GetUserFavoritesPresenter.js';
import { AddUserFavoritesPresenter } from '../presenters/AddUserFavoritesPresenter.js';
import { DeleteUserFavoritesPresenter } from '../presenters/DeleteUserFavoritesPresenter.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUsersPresenter: GetUsersPresenter,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly getCurrentUserPresenter: GetCurrentUserPresenter,
    private readonly getUserFavoritesUseCase: GetUserFavoritesUseCase,
    private readonly getUserFavoritesPresenter: GetUserFavoritesPresenter,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
    private readonly getUserRolesPresenter: GetUserRolesPresenter,
    private readonly addUserFavoritesUseCase: AddUserFavoritesUseCase,
    private readonly addUserFavoritesPresenter: AddUserFavoritesPresenter,
    private readonly addUserRoleUseCase: AddUserRoleUseCase,
    private readonly addUserRolePresenter: AddUserRolePresenter,
    private readonly deleteUserFavoritesUseCase: DeleteUserFavoritesUseCase,
    private readonly deleteUserFavoritesPresenter: DeleteUserFavoritesPresenter,
    private readonly deleteUserRoleUseCase: DeleteUserRoleUseCase,
    private readonly deleteUserRolePresenter: DeleteUserRolePresenter,
  ) {}

  @ApiOkResponse({ type: GetUsersResponseDto })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
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
    const result = await this.getUsersUseCase.execute({
      tenantId: claims.tid,
      active: query.active,
      page: query.page,
      limit: query.limit,
    });

    return this.getUsersPresenter.present(result);
  }

  @ApiOkResponse({ type: GetCurrentUserResponseDto })
  @Get('me')
  async handleGetMe(@Claims() claims: AuthClaim) {
    const result = await this.getCurrentUserUseCase.execute({
      userId: claims.sub,
    });

    return this.getCurrentUserPresenter.present(result);
  }

  @ApiOkResponse({ type: GetUserFavoritesResponseDto })
  @Get('me/favorites')
  async handleGetFavorites(@Claims() claims: AuthClaim) {
    try {
      const result = await this.getUserFavoritesUseCase.execute({
        initiatorUserId: claims.sub,
        userId: claims.sub,
      });

      return this.getUserFavoritesPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof UserFavoriteActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: AddUserFavoritesResponseDto })
  @Post('me/favorites')
  async handleAddFavorites(
    @Body() addUserFavoritesRequestDto: AddUserFavoritesRequestDto,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result = await this.addUserFavoritesUseCase.execute({
        initiatorUserId: claims.sub,
        userId: claims.sub,
        favoriteUserId:
          addUserFavoritesRequestDto.favoriteUserId,
      });

      return this.addUserFavoritesPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof UserFavoriteActionForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOkResponse({ type: DeleteUserFavoritesResponseDto })
  @Delete('me/favorites/:favoriteId')
  async handleDeleteFavorites(
    @Param('favoriteId') favoriteId: string,
    @Claims() claims: AuthClaim,
  ) {
    try {
      const result =
        await this.deleteUserFavoritesUseCase.execute({
          initiatorUserId: claims.sub,
          favoriteId,
        });

      return this.deleteUserFavoritesPresenter.present(result);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException('User does not exist.');
      }

      if (error instanceof UserFavoriteNotFoundException) {
        throw new NotFoundException(
          'User favorite does not exist.',
        );
      }

      if (error instanceof UserFavoriteActionForbiddenException) {
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
