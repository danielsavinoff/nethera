import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthClaim } from '../../../../application/models/AuthClaim.js';

interface ClaimsRequest extends Request {
  claims?: AuthClaim;
}

export const Claims = createParamDecorator(
  (data: keyof AuthClaim | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<ClaimsRequest>();
    const claims = request.claims;

    return data ? claims?.[data] : claims;
  },
);
