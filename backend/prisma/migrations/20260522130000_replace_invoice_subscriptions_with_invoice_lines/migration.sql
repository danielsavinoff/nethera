DROP TABLE "invoice_subscriptions";

CREATE TABLE "invoice_lines" (
    "id" UUID NOT NULL,
    "reference_id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "amount" INTEGER NOT NULL,
    "invoice_id" UUID NOT NULL,

    CONSTRAINT "invoice_lines_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "invoice_lines_reference_id_type_key" ON "invoice_lines"("reference_id", "type");

CREATE INDEX "invoice_lines_invoice_id_idx" ON "invoice_lines"("invoice_id");

ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
