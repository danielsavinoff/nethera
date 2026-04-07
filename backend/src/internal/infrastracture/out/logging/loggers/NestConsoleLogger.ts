import {
  Injectable,
  Logger as NestLoggerCore,
} from '@nestjs/common';
import { Logger } from '../../../../domain/logging/Logger.js';

@Injectable()
export class NestConsoleLogger implements Logger {
  private readonly logger: NestLoggerCore;

  constructor(context: string) {
    this.logger = new NestLoggerCore(context);
  }

  withContext(context: string): Logger {
    return new NestConsoleLogger(context);
  }

  log(message: string) {
    this.logger.log(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }
}
