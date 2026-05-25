import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  Translator,
  TranslatorFactory,
} from '../../../../application/ports/Translator.js';
import { DefaultTranslator } from './DefaultTranslator.js';

@Injectable()
export class DefaultTranslatorFactory
  implements TranslatorFactory
{
  constructor(private readonly i18nService: I18nService) {}

  forLocale(locale: string): Translator {
    return new DefaultTranslator(locale, this.i18nService);
  }
}
