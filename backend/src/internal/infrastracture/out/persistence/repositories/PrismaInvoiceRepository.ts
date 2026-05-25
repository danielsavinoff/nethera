import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { InvoiceNotFoundException } from '../../../../application/exceptions/InvoiceNotFoundException.js';
import {
  PaginatedRepositoryQuery,
  RepositoryQuery,
} from '../../../../application/models/RepositoryQuery.js';
import { TransactionContext } from '../../../../application/models/TransactionContext.js';
import type {
  InvoiceRepository,
  InvoiceWith,
} from '../../../../application/ports/InvoiceRepository.js';
import { Invoice } from '../../../../domain/subscription/Invoice.js';
import { InvoiceLine } from '../../../../domain/subscription/InvoiceLine.js';
import { InvoiceLineRecord } from '../../../../domain/subscription/InvoiceLineRecord.js';
import { InvoiceRecord } from '../../../../domain/subscription/InvoiceRecord.js';
import { PrismaBaseRepository } from '../base/PrismaBaseRepository.js';

@Injectable()
export class PrismaInvoiceRepository
  extends PrismaBaseRepository
  implements InvoiceRepository
{
  private readonly fieldMaps = {
    invoices: {
      id: 'id',
      externalId: 'external_id',
      provider: 'provider',
      billingEmail: 'billing_email',
      userId: 'user_id',
      status: 'status',
      totalAmountMinor: 'total_amount_minor',
      amountPaidMinor: 'amount_paid_minor',
      currency: 'currency',
      externalCheckoutUrl: 'external_checkout_url',
      expiresAt: 'expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    } satisfies Record<keyof InvoiceRecord, string>,
    invoiceLines: {
      id: 'id',
      referenceId: 'reference_id',
      type: 'type',
      title: 'title',
      amount: 'amount',
      invoiceId: 'invoice_id',
    } satisfies Record<keyof InvoiceLineRecord, string>,
  };

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async load(
    query: RepositoryQuery<InvoiceRecord, InvoiceWith>,
    transactionContext?: TransactionContext,
  ): Promise<Invoice | null> {
    const client = this.getClient(transactionContext);

    const row = await client.invoice.findFirst({
      ...(query.filter
        ? {
            where: this.buildWhere<
              InvoiceRecord,
              Prisma.InvoiceWhereInput
            >(query.filter, this.fieldMaps.invoices),
          }
        : {}),
      include: {
        lines: query.with?.lines
          ? {
              where:
                typeof query.with?.lines !== 'boolean' &&
                query.with?.lines.filter
                  ? this.buildWhere<
                      InvoiceLineRecord,
                      Prisma.InvoiceLineWhereInput
                    >(
                      query.with?.lines.filter,
                      this.fieldMaps.invoiceLines,
                    )
                  : undefined,
            }
          : false,
      },
    });

    if (!row) {
      return null;
    }

    const invoice = Invoice.hydrate({
      id: row.id,
      externalId: row.external_id,
      provider: row.provider,
      billingEmail: row.billing_email,
      userId: row.user_id,
      status: row.status,
      totalAmountMinor: row.total_amount_minor,
      amountPaidMinor: row.amount_paid_minor,
      currency: row.currency,
      externalCheckoutUrl: row.external_checkout_url,
      expiresAt: row.expires_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });

    if (!query.with) {
      return invoice;
    }

    return invoice.withLines(
      row.lines.map((line) =>
        InvoiceLine.hydrate({
          id: line.id,
          referenceId: line.reference_id,
          type: line.type,
          title: line.title ?? undefined,
          amount: line.amount,
          invoiceId: line.invoice_id,
        }),
      ),
    );
  }

  async loadOrThrow(
    query: RepositoryQuery<InvoiceRecord, InvoiceWith>,
    transactionContext?: TransactionContext,
  ): Promise<Invoice> {
    const invoice = await this.load(query, transactionContext);

    if (!invoice) {
      throw new InvoiceNotFoundException();
    }

    return invoice;
  }

  async loadMany(
    query: PaginatedRepositoryQuery<InvoiceRecord, InvoiceWith>,
    transactionContext?: TransactionContext,
  ): Promise<Invoice[]> {
    const client = this.getClient(transactionContext);

    const rows = await client.invoice.findMany({
      where: query.filter
        ? this.buildWhere<
            InvoiceRecord,
            Prisma.InvoiceWhereInput
          >(query.filter, this.fieldMaps.invoices)
        : undefined,
      include: {
        lines: query.with?.lines
          ? {
              where:
                typeof query.with?.lines !== 'boolean' &&
                query.with?.lines.filter
                  ? this.buildWhere<
                      InvoiceLineRecord,
                      Prisma.InvoiceLineWhereInput
                    >(
                      query.with?.lines.filter,
                      this.fieldMaps.invoiceLines,
                    )
                  : undefined,
            }
          : false,
      },
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
      take: query.page?.limit,
      skip: query.page?.offset,
    });

    return rows.map((row) => {
      const invoice = Invoice.hydrate({
        id: row.id,
        externalId: row.external_id,
        provider: row.provider,
        billingEmail: row.billing_email,
        userId: row.user_id,
        status: row.status,
        totalAmountMinor: row.total_amount_minor,
        amountPaidMinor: row.amount_paid_minor,
        currency: row.currency,
        externalCheckoutUrl: row.external_checkout_url,
        expiresAt: row.expires_at ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });

      if (!query.with) {
        return invoice;
      }

      return invoice.withLines(
        row.lines.map((line) =>
          InvoiceLine.hydrate({
            id: line.id,
            referenceId: line.reference_id,
            type: line.type,
            title: line.title ?? undefined,
            amount: line.amount,
            invoiceId: line.invoice_id,
          }),
        ),
      );
    });
  }

  async save(
    invoice: Invoice,
    transactionContext?: TransactionContext,
  ): Promise<Invoice> {
    const client = this.getClient(transactionContext);

    const record = invoice.toRecord();

    const row = await client.invoice.upsert({
      where: {
        id: record.id,
      },
      create: {
        id: record.id,
        external_id: record.externalId,
        provider: record.provider,
        billing_email: record.billingEmail,
        user_id: record.userId,
        status: record.status,
        total_amount_minor: record.totalAmountMinor,
        amount_paid_minor: record.amountPaidMinor,
        currency: record.currency,
        external_checkout_url: record.externalCheckoutUrl,
        expires_at: record.expiresAt,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
      update: {
        external_id: record.externalId,
        provider: record.provider,
        billing_email: record.billingEmail,
        user_id: record.userId,
        status: record.status,
        total_amount_minor: record.totalAmountMinor,
        amount_paid_minor: record.amountPaidMinor,
        currency: record.currency,
        external_checkout_url: record.externalCheckoutUrl,
        expires_at: record.expiresAt,
        updated_at: record.updatedAt,
      },
    });

    return Invoice.hydrate({
      id: row.id,
      externalId: row.external_id,
      provider: row.provider,
      billingEmail: row.billing_email,
      userId: row.user_id,
      status: row.status,
      totalAmountMinor: row.total_amount_minor,
      amountPaidMinor: row.amount_paid_minor,
      currency: row.currency,
      externalCheckoutUrl: row.external_checkout_url,
      expiresAt: row.expires_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }).withLines(invoice.lines);
  }
}
