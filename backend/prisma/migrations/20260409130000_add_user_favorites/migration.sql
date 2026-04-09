-- CreateTable
CREATE TABLE "favorite_users" (
    "id" TEXT NOT NULL,
    "favoriter_user_id" TEXT NOT NULL,
    "favorited_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_users_favoriter_user_id_favorited_user_id_key" ON "favorite_users"("favoriter_user_id", "favorited_user_id");

-- AddForeignKey
ALTER TABLE "favorite_users" ADD CONSTRAINT "favorite_users_favoriter_user_id_fkey" FOREIGN KEY ("favoriter_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_users" ADD CONSTRAINT "favorite_users_favorited_user_id_fkey" FOREIGN KEY ("favorited_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
