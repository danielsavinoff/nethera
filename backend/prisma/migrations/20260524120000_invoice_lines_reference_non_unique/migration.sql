DROP INDEX IF EXISTS "invoice_lines_reference_id_type_key";

CREATE INDEX "invoice_lines_reference_id_type_idx" ON "invoice_lines"("reference_id", "type");
