CREATE TABLE "auth_tokens" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "email" CITEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "requested_ip" INET,
  "requested_user_agent" TEXT,
  "token_hash" TEXT NOT NULL,
  "used_at" TIMESTAMP(3),

  CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "auth_tokens_token_hash_key"
ON "auth_tokens"("token_hash");
