-- Sprint 4: B2B financial architecture, payment splits, and legal compliance.

ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CONTRACT_PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CONTRACT_SIGNED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'SETTLED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELED';

DO $$
BEGIN
  CREATE TYPE "SplitCalculationType" AS ENUM ('PERCENTAGE', 'FIXED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "RecipientStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "LedgerAccount" AS ENUM ('STUDENT_RECEIVABLE', 'IUGU_CLEARING', 'PLATFORM_REVENUE', 'LANDLORD_PAYABLE', 'CONTRACT_ESCROW');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "LedgerDirection" AS ENUM ('DEBIT', 'CREDIT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "LegalAgreementStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'CANCELED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "ProviderEventStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'IGNORED', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "split_rule_id" TEXT;
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "idempotency_key" TEXT;
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "iugu_split_payload" JSONB;
ALTER TABLE "reservations" ADD COLUMN IF NOT EXISTS "payment_expires_at" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "reservations_idempotency_key_key" ON "reservations"("idempotency_key");
CREATE INDEX IF NOT EXISTS "reservations_room_id_idx" ON "reservations"("room_id");
CREATE INDEX IF NOT EXISTS "reservations_split_rule_id_idx" ON "reservations"("split_rule_id");
CREATE INDEX IF NOT EXISTS "reservations_status_idx" ON "reservations"("status");

DO $$
BEGIN
  ALTER TABLE "reservations" ADD CONSTRAINT "reservations_split_rule_id_fkey" FOREIGN KEY ("split_rule_id") REFERENCES "split_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "payment_recipients" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'IUGU_SANDBOX',
    "provider_account_id" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "bank_code" TEXT,
    "agency" TEXT,
    "account_number" TEXT,
    "pix_key" TEXT,
    "status" "RecipientStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_recipients_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_recipients_user_id_key" ON "payment_recipients"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "payment_recipients_provider_account_id_key" ON "payment_recipients"("provider_account_id");
CREATE INDEX IF NOT EXISTS "payment_recipients_status_idx" ON "payment_recipients"("status");

DO $$
BEGIN
  ALTER TABLE "payment_recipients" ADD CONSTRAINT "payment_recipients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "payment_splits" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "split_rule_id" TEXT,
    "calculation_type" "SplitCalculationType" NOT NULL,
    "platform_fee_pct" DECIMAL(5,2) NOT NULL,
    "platform_amount" DECIMAL(10,2) NOT NULL,
    "landlord_amount" DECIMAL(10,2) NOT NULL,
    "provider_payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_splits_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_splits_reservation_id_key" ON "payment_splits"("reservation_id");
CREATE INDEX IF NOT EXISTS "payment_splits_recipient_id_idx" ON "payment_splits"("recipient_id");
CREATE INDEX IF NOT EXISTS "payment_splits_split_rule_id_idx" ON "payment_splits"("split_rule_id");

DO $$
BEGIN
  ALTER TABLE "payment_splits" ADD CONSTRAINT "payment_splits_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "payment_splits" ADD CONSTRAINT "payment_splits_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "payment_recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "payment_splits" ADD CONSTRAINT "payment_splits_split_rule_id_fkey" FOREIGN KEY ("split_rule_id") REFERENCES "split_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ledger_entries" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "account" "LedgerAccount" NOT NULL,
    "direction" "LedgerDirection" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "idempotency_key" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ledger_entries_idempotency_key_key" ON "ledger_entries"("idempotency_key");
CREATE INDEX IF NOT EXISTS "ledger_entries_reservation_id_idx" ON "ledger_entries"("reservation_id");
CREATE INDEX IF NOT EXISTS "ledger_entries_account_idx" ON "ledger_entries"("account");

DO $$
BEGIN
  ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "finance_webhook_events" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "event_key" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "signature" TEXT,
    "payload" JSONB NOT NULL,
    "status" "ProviderEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "reservation_id" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finance_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "finance_webhook_events_event_key_key" ON "finance_webhook_events"("event_key");
CREATE INDEX IF NOT EXISTS "finance_webhook_events_provider_idx" ON "finance_webhook_events"("provider");
CREATE INDEX IF NOT EXISTS "finance_webhook_events_reservation_id_idx" ON "finance_webhook_events"("reservation_id");
CREATE INDEX IF NOT EXISTS "finance_webhook_events_status_idx" ON "finance_webhook_events"("status");

DO $$
BEGIN
  ALTER TABLE "finance_webhook_events" ADD CONSTRAINT "finance_webhook_events_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "legal_agreements" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'CLICKSIGN_SANDBOX',
    "provider_document_id" TEXT NOT NULL,
    "document_key" TEXT NOT NULL,
    "status" "LegalAgreementStatus" NOT NULL DEFAULT 'SENT',
    "signature_request_url" TEXT,
    "student_email" TEXT NOT NULL,
    "landlord_email" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legal_agreements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "legal_agreements_reservation_id_key" ON "legal_agreements"("reservation_id");
CREATE UNIQUE INDEX IF NOT EXISTS "legal_agreements_provider_document_id_key" ON "legal_agreements"("provider_document_id");
CREATE UNIQUE INDEX IF NOT EXISTS "legal_agreements_document_key_key" ON "legal_agreements"("document_key");
CREATE INDEX IF NOT EXISTS "legal_agreements_status_idx" ON "legal_agreements"("status");

DO $$
BEGIN
  ALTER TABLE "legal_agreements" ADD CONSTRAINT "legal_agreements_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO "split_rules" ("id", "platform_fee_pct", "active_from")
SELECT 'default-sprint-4-split-rule', 10.00, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "split_rules" WHERE "id" = 'default-sprint-4-split-rule'
);
