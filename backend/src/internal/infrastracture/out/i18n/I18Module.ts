import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  I18nJsonLoader,
  I18nModule as NestI18nModule,
} from 'nestjs-i18n';
import path from 'path';
import { fileURLToPath } from 'url';
import { DefaultTranslatorFactory } from './translators/DefaultTranslatorFactory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

@Global()
@Module({
  imports: [
    NestI18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      loader: I18nJsonLoader,
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow(
          'FALLBACK_LANGUAGE',
        ),
        loaderOptions: {
          path: path.join(__dirname, 'locales'),
          watch: true,
        },
      }),
    }),
  ],
  providers: [DefaultTranslatorFactory],
  exports: [NestI18nModule, DefaultTranslatorFactory],
})
export class I18Module {}
