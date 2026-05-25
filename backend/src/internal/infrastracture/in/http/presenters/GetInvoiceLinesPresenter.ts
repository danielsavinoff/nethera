import { Injectable } from '@nestjs/common';
import { GetInvoiceLinesResult } from '../../../../application/usecases/GetInvoiceLinesUseCase.js';
import { MoneyFormatter } from '../../../../domain/money/MoneyFormatter.js';
import { GetInvoiceLineAmountResponseDto } from '../dtos/GetInvoiceLineAmountResponseDto.js';
import { GetInvoiceLineResponseDto } from '../dtos/GetInvoiceLineResponseDto.js';
import { GetInvoiceLinesResponseDto } from '../dtos/GetInvoiceLinesResponseDto.js';

@Injectable()
export class GetInvoiceLinesPresenter {
  present(
    result: GetInvoiceLinesResult,
  ): GetInvoiceLinesResponseDto {
    return new GetInvoiceLinesResponseDto({
      lines: result.data.lines.map(
        (line) =>
          new GetInvoiceLineResponseDto({
            title:
              line.title ??
              this.getUntitledInvoiceLineTitle(result.data.locale),
            amount: new GetInvoiceLineAmountResponseDto({
              minor: line.amount,
              currency: result.data.currency,
              formatted: MoneyFormatter.format(
                line.amount,
                result.data.locale,
                result.data.currency,
              ),
            }),
          }),
      ),
    });
  }

  private getUntitledInvoiceLineTitle(locale: string): string {
    if (locale.startsWith('ru')) {
      return 'Позиция без названия';
    }

    return 'Untitled item';
  }
}
