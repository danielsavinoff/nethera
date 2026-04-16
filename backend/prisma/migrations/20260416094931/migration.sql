-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_allocations" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "group_id" TEXT,
    "task_id" TEXT NOT NULL,
    "priority" VARCHAR(64) NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "is_approved" BOOLEAN NOT NULL,
    "week_number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "assignee_id" TEXT NOT NULL,
    "assigner_id" TEXT NOT NULL,

    CONSTRAINT "time_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_external_id_tenant_id_key" ON "groups"("external_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_external_id_tenant_id_key" ON "tasks"("external_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "time_allocations_external_id_tenant_id_key" ON "time_allocations"("external_id", "tenant_id");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_allocations" ADD CONSTRAINT "time_allocations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_allocations" ADD CONSTRAINT "time_allocations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_allocations" ADD CONSTRAINT "time_allocations_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_allocations" ADD CONSTRAINT "time_allocations_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_allocations" ADD CONSTRAINT "time_allocations_assigner_id_fkey" FOREIGN KEY ("assigner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
