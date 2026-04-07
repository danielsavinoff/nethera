import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { UseCaseModule } from './UseCaseModule.js';
import { HttpModule } from '../in/http/HttpModule.js';
import { AuthModule } from '../out/auth/AuthModule.js';
import { PersistenceModule } from '../out/persistence/PersistenceModule.js';
import { AuthGuard } from '../in/http/guards/AuthGuard.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    HttpModule,
    UseCaseModule,
    AuthModule,
    PersistenceModule,
  ],
  providers: [
    {
      provide: PrismaClient,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const server = config.get<string>('DATABASE_SERVER');
        const user = config.get<string>('DATABASE_USER');
        const pass = config.get<string>('DATABASE_PASS');
        const host = config.get<string>('DATABASE_HOST');
        const port = config.get<string>('DATABASE_PORT');
        const db = config.get<string>('DATABASE');

        const connectionString = `${server}://${user}:${pass}@${host}:${port}/${db}`;
        const adapter = new PrismaPg({ connectionString });
        const prisma = new PrismaClient({ adapter });

        await prisma.$connect();

        return prisma;
      },
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [PrismaClient],
})
export class AppModule {}
