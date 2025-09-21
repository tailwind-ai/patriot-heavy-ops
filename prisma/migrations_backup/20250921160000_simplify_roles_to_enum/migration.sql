-- Drop the existing role column first (it was added in previous migration with old enum)
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";

-- Drop the old UserRole enum and recreate with new values
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- Create new UserRole enum with correct values
CREATE TYPE "UserRole" AS ENUM ('USER', 'OPERATOR', 'MANAGER', 'ADMIN');

-- Add role column to users table with default USER
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Migrate existing user roles from user_roles table to users.role
UPDATE "users" SET "role" = 
  CASE 
    WHEN EXISTS (SELECT 1 FROM "user_roles" ur JOIN "roles" r ON ur.role_id = r.id WHERE ur.user_id = users.id AND r.name = 'ADMIN') THEN 'ADMIN'
    WHEN EXISTS (SELECT 1 FROM "user_roles" ur JOIN "roles" r ON ur.role_id = r.id WHERE ur.user_id = users.id AND r.name = 'MANAGER') THEN 'MANAGER'
    WHEN EXISTS (SELECT 1 FROM "user_roles" ur JOIN "roles" r ON ur.role_id = r.id WHERE ur.user_id = users.id AND r.name = 'OPERATOR') THEN 'OPERATOR'
    ELSE 'USER'
  END;

-- Drop foreign key constraints first
ALTER TABLE "user_roles" DROP CONSTRAINT IF EXISTS "user_roles_user_id_fkey";
ALTER TABLE "user_roles" DROP CONSTRAINT IF EXISTS "user_roles_role_id_fkey";
ALTER TABLE "user_roles" DROP CONSTRAINT IF EXISTS "user_roles_assigned_by_fkey";

-- Drop the complex role tables
DROP TABLE IF EXISTS "user_roles";
DROP TABLE IF EXISTS "roles";

-- Drop the old UserRole enum if it exists (it was created earlier but not used)
DROP TYPE IF EXISTS "UserRole_old";
