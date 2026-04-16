ALTER TABLE "groups"
ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "tasks"
ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "time_allocations"
ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
