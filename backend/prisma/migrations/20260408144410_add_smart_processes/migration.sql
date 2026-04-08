-- CreateTable
CREATE TABLE "smart_processes" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "smart_processes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "smart_processes_tenant_id_key" ON "smart_processes"("tenant_id");

-- AddForeignKey
ALTER TABLE "smart_processes" ADD CONSTRAINT "smart_processes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
