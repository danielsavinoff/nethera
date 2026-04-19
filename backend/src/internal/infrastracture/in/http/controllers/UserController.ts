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
import { AddUserRoleRequestDto } from '../dtos/AddUserRoleRequestDto.js';
import { AddUserRoleResponseDto } from '../dtos/AddUserRoleResponseDto.js';
import { AddUserRolePresenter } from '../presenters/AddUserRolePresenter.js';
import { DeleteUserRoleUseCase } from '../../../../application/usecases/DeleteUserRoleUseCase.js';
import { DeleteUserRolePresenter } from '../presenters/DeleteUserRolePresenter.js';
import { DeleteUserRoleResponseDto } from '../dtos/DeleteUserRoleResponseDto.js';
import { RoleNotFoundException } from '../../../../application/exceptions/RoleNotFoundException.js';
import { UserRoleAssignmentNotFoundException } from '../../../../application/exceptions/UserRoleAssignmentNotFoundException.js';
import { RoleActionForbiddenException } from '../../../../domain/authorization/RoleActionForbiddenException.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUsersPresenter: GetUsersPresenter,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly getCurrentUserPresenter: GetCurrentUserPresenter,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
    private readonly getUserRolesPresenter: GetUserRolesPresenter,
    private readonly addUserRoleUseCase: AddUserRoleUseCase,
    private readonly addUserRolePresenter: AddUserRolePresenter,
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
  async handleGetUsers(@Query() query: GetUsersQueryDto) {
    const result = await this.getUsersUseCase.execute({
      active: query.active,
      q: query.q,
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
