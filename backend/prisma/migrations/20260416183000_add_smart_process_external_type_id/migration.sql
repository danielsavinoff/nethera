ALTER TABLE "smart_processes"
ADD COLUMN "external_type_id" TEXT;

UPDATE "smart_processes"
SET "external_type_id" = "external_id"
WHERE "external_type_id" IS NULL;

ALTER TABLE "smart_processes"
ALTER COLUMN "external_type_id" SET NOT NULL;
