-- CreateIndex
CREATE INDEX "groups_tenant_id_is_deleted_idx" ON "groups"("tenant_id", "is_deleted");
