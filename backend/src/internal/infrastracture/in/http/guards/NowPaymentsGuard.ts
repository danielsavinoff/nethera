import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';

interface NowPaymentsRequest extends Request {
  body: unknown;
}

@Injectable()
export class NowPaymentsGuard implements CanActivate {
  private readonly ipnSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.ipnSecret = this.configService.getOrThrow<string>(
      'NOWPAYMENTS_IPN_SECRET',
    );
  }

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') {
      throw new UnauthorizedException();
    }

    const request = context
      .switchToHttp()
      .getRequest<NowPaymentsRequest>();

    const signatureHeader = request.headers['x-nowpayments-sig'];

    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;

    if (
      !signature ||
      !this.isValidSignature(signature, request.body)
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private isValidSignature(
    signature: string,
    body: unknown,
  ): boolean {
    const hmac = createHmac('sha512', this.ipnSecret);

    hmac.update(JSON.stringify(this.sortObject(body)));

    const expectedSignature = hmac.digest('hex');

    return this.compareSignatures(signature, expectedSignature);
  }

  private sortObject(value: unknown): unknown {
    if (!value || typeof value !== 'object') {
      return value;
    }

    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        const objectValue = value as Record<string, unknown>;
        const item = objectValue[key];

        result[key] =
          item && typeof item === 'object'
            ? this.sortObject(item)
            : item;

        return result;
      }, {});
  }

  private compareSignatures(
    signature: string,
    expectedSignature: string,
  ): boolean {
    const signatureBuffer = Buffer.from(signature, 'hex');

    const expectedSignatureBuffer = Buffer.from(
      expectedSignature,
      'hex',
    );

    if (
      signatureBuffer.length !== expectedSignatureBuffer.length
    ) {
      return false;
    }

    return timingSafeEqual(
      signatureBuffer,
      expectedSignatureBuffer,
    );
  }
}
