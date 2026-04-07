import { Module, Scope } from '@nestjs/common';
import { NestConsoleLogger } from './loggers/NestConsoleLogger.js';
import { INQUIRER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: NestConsoleLogger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: <T extends object>(inquirer?: T) => {
        return new NestConsoleLogger(
          inquirer?.constructor.name ?? 'Unknown source',
        );
      },
    },
  ],
  exports: [NestConsoleLogger],
})
export class LoggingWiringModule {}
