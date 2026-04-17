ALTER TABLE "groups"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3);

UPDATE "groups"
SET "updated_at" = "created_at"
WHERE "updated_at" IS NULL;

ALTER TABLE "groups"
ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "tasks"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3);

UPDATE "tasks"
SET "updated_at" = "created_at"
WHERE "updated_at" IS NULL;

ALTER TABLE "tasks"
ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "time_allocations"
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3);

UPDATE "time_allocations"
SET "updated_at" = "created_at"
WHERE "updated_at" IS NULL;

ALTER TABLE "time_allocations"
ALTER COLUMN "updated_at" SET NOT NULL;
