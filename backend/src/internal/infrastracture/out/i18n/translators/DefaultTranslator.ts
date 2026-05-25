import { I18nService } from 'nestjs-i18n';
import {
  TranslatableOptions,
  TranslationKey,
  Translator,
} from '../../../../application/ports/Translator.js';

export class DefaultTranslator implements Translator {
  private readonly translationPaths = {
    [TranslationKey.SubscriptionPlanInvoiceLineTitle]:
      'common.invoice.subscriptionPlanLineTitle',
  } satisfies Record<TranslationKey, string>;

  constructor(
    private readonly locale: string,
    private readonly i18nService: I18nService,
  ) {}

  translate<T extends TranslationKey>(
    key: T,
    options: TranslatableOptions<T>,
  ): string {
    const interval =
      'interval' in options ? `.${options.interval}` : '';

    return this.i18nService.translate(
      `${this.translationPaths[key]}${interval}`,
      {
        lang: this.locale,
        args: options,
      },
    );
  }
}
