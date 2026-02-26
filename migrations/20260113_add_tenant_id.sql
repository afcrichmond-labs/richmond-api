-- Migration: Add tenant_id column to users table
-- Strategy: Online DDL via gh-ost (zero-downtime)
-- Estimated duration: 4 hours for 2.3M rows

-- Step 1: Add nullable column
ALTER TABLE users ADD COLUMN tenant_id UUID NULL;

-- Step 2: Add index (concurrent to avoid locks)
CREATE INDEX CONCURRENTLY idx_users_tenant_email ON users(tenant_id, email);

-- Step 3: Backfill default tenant (run as background job)
-- UPDATE users SET tenant_id = 'default-tenant-uuid' WHERE tenant_id IS NULL;
-- Note: Run in batches of 10,000 to avoid long transactions

-- Step 4: Make NOT NULL (after backfill complete)
-- ALTER TABLE users ALTER COLUMN tenant_id SET NOT NULL;
