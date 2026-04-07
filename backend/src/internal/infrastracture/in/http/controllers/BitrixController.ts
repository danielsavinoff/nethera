import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  AjaxError as B24JsSdkException,
  type EventHandlerParams as EventHandlerBody,
} from '@bitrix24/b24jssdk';
import { EventSubscriptionFailedException } from '../../../../application/exceptions/EventSubscriptionFailedException.js';
import { UnknownTenantException } from '../../../../application/exceptions/UnknownTenantException.js';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { UserNotBitrixAdminException } from '../../../../application/exceptions/UserNotBitrixAdminException.js';
import { InstallAppUseCase } from '../../../../application/usecases/InstallAppUseCase.js';
import { EventGuard } from '../guards/EventGuard.js';
import { TenantDecorator } from '../decorators/Tenant.js';
import { BitrixEventModelMapper } from '../../../out/bitrix/mappers/BitrixEventModelMapper.js';
import { TenantGuard } from '../guards/TenantGuard.js';
import { BitrixEventAuthContextMapper } from '../../../out/bitrix/mappers/BitrixEventAuthContextMapper.js';
import { Tenant } from '../../../../../internal/domain/tenant/Tenant.js';
import { Public } from '../decorators/Public.js';
import { HandleInstallationRequestDto } from '../dtos/HandleInstallationRequestDto.js';
import { HandleIncomingWebhookUseCase } from '../../../../application/usecases/HandleIncomingWebhookUseCase.js';

@Public()
@Controller('bitrix')
export class BitrixController {
  constructor(
    private readonly bitrixEventModelMapper: BitrixEventModelMapper,
    private readonly bitrixEventAuthContextMapper: BitrixEventAuthContextMapper,
    private readonly handleIncomingWebhookUseCase: HandleIncomingWebhookUseCase,
    private readonly installAppUseCase: InstallAppUseCase,
  ) {}

  @ApiNoContentResponse()
  @Post('install')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleInstall(
    @Body()
    handleInstallationRequestDto: HandleInstallationRequestDto,
  ) {
    try {
      await this.installAppUseCase.execute({
        accessToken: handleInstallationRequestDto.accessToken,
        refreshToken: handleInstallationRequestDto.refreshToken,
        accessTokenTtlSeconds:
          handleInstallationRequestDto.expiresIn,
        domain: handleInstallationRequestDto.domain,
        memberId: handleInstallationRequestDto.memberId,
        clientEndpoint: `https://${handleInstallationRequestDto.domain}/rest`,
      });
    } catch (error) {
      if (error instanceof UserNotBitrixAdminException) {
        throw new ForbiddenException(
          'Only an administrator is allowed to run the installation master.',
        );
      }
      if (error instanceof EventSubscriptionFailedException) {
        throw new InternalServerErrorException(
          'An error happened during Bitrix24 event subscription. Try again or contact us.',
        );
      }
      if (error instanceof B24JsSdkException) {
        // TODO: Add more error handlng
        console.log(error);
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  @ApiNoContentResponse()
  @Post('webhook')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TenantGuard, EventGuard)
  async handleWebhook(
    @Body() event: EventHandlerBody,
    @TenantDecorator() tenant: Tenant,
  ) {
    try {
      const eventName = event.event;
      const eventModel = this.bitrixEventModelMapper.map(event);
      const tenantCredentials =
        this.bitrixEventAuthContextMapper.map({
          auth: event.auth,
          tenant: tenant,
        });

      await this.handleIncomingWebhookUseCase.execute({
        eventName: eventName,
        payload: eventModel,
        tenantCredentials: tenantCredentials,
        tenant: tenant,
      });
    } catch (error) {
      if (error instanceof UnknownTenantException) {
        throw new UnauthorizedException(
          'Your Bitrix tenant is not registered. Try to reinstall the application.',
        );
      }
      if (error instanceof UserNotBitrixAdminException) {
        throw new ForbiddenException(
          'Only an administrator is allowed to send events.',
        );
      }

      throw error;
    }
  }
}
