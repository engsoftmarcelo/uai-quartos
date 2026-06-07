-- Sprint 2: geospatial property inventory and landlord media foundation.

CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE "republics" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "republics" ADD COLUMN IF NOT EXISTS "neighborhood" TEXT;
ALTER TABLE "republics" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "republics" ADD COLUMN IF NOT EXISTS "state" TEXT DEFAULT 'MG';
ALTER TABLE "republics" ADD COLUMN IF NOT EXISTS "postal_code" TEXT;
ALTER TABLE "republics" ADD COLUMN IF NOT EXISTS "image_url" TEXT;

ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "private_bathroom" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "capacity" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "rooms" ADD COLUMN IF NOT EXISTS "area_m2" DECIMAL(5,2);

CREATE TABLE IF NOT EXISTS "property_photos" (
    "id" TEXT NOT NULL,
    "republic_id" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "image_url" TEXT,
    "alt_text" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_photos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "property_photos_storage_key_key" ON "property_photos"("storage_key");
CREATE INDEX IF NOT EXISTS "property_photos_republic_id_idx" ON "property_photos"("republic_id");
CREATE INDEX IF NOT EXISTS "republics_location_idx" ON "republics" USING GIST ("location");
CREATE INDEX IF NOT EXISTS "republics_deleted_at_idx" ON "republics"("deleted_at");
CREATE INDEX IF NOT EXISTS "rooms_republic_id_is_available_idx" ON "rooms"("republic_id", "is_available");
CREATE INDEX IF NOT EXISTS "rooms_base_price_idx" ON "rooms"("base_price");

DO $$
BEGIN
  ALTER TABLE "property_photos" ADD CONSTRAINT "property_photos_republic_id_fkey" FOREIGN KEY ("republic_id") REFERENCES "republics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
