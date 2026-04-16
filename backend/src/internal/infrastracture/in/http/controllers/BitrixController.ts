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
  type EventHandlerParams as HandleWebhookRequestBody,
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
import { Tenant } from '../../../../../internal/domain/tenant/Tenant.js';
import { Public } from '../decorators/Public.js';
import { HandleInstallationRequestDto } from '../dtos/HandleInstallationRequestDto.js';
import { DispatchIncomingWebhookUseCase } from '../../../../application/usecases/DispatchIncomingWebhookUseCase.js';
import { TenantCredentials } from '../../../../domain/tenant/TenantCredentials.js';
import { TenantCredentialsMissingException } from '../../../../application/exceptions/TenantCredentialsMissingException.js';

@Public()
@Controller('bitrix')
export class BitrixController {
  constructor(
    private readonly bitrixEventModelMapper: BitrixEventModelMapper,
    private readonly dispatchIncomingWebhookUseCase: DispatchIncomingWebhookUseCase,
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
    @Body() handleWebhookRequestBody: HandleWebhookRequestBody,
    @TenantDecorator() tenant: Tenant,
  ) {
    try {
      const auth = handleWebhookRequestBody.auth;

      if (!auth) {
        throw new TenantCredentialsMissingException();
      }

      const event = handleWebhookRequestBody.event;

      const eventModel = this.bitrixEventModelMapper.map(
        handleWebhookRequestBody,
      );

      const tenantCredentials = TenantCredentials.hydrate({
        accessToken: auth.access_token,
        refreshToken: auth.refresh_token,
        expiresIn: Number(auth.expires_in),
        memberId: auth.member_id,
        domain: auth.domain,
        clientEndpoint: auth.client_endpoint,
      });

      await this.dispatchIncomingWebhookUseCase.execute({
        eventName: event,
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
      if (error instanceof TenantCredentialsMissingException) {
        throw new UnauthorizedException(
          'Tenant credentials are missing.',
        );
      }

      throw error;
    }
  }
}
