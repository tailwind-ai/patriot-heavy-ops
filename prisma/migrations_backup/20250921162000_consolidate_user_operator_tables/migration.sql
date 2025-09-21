-- Add operator-specific fields to users table
ALTER TABLE "users" ADD COLUMN "military_branch" TEXT;
ALTER TABLE "users" ADD COLUMN "years_of_service" INTEGER;
ALTER TABLE "users" ADD COLUMN "certifications" TEXT[] DEFAULT '{}';
ALTER TABLE "users" ADD COLUMN "preferred_locations" TEXT[] DEFAULT '{}';
ALTER TABLE "users" ADD COLUMN "is_available" BOOLEAN NOT NULL DEFAULT true;

-- Update foreign key constraint in assignments to point to users instead of operators
ALTER TABLE "assignments" DROP CONSTRAINT IF EXISTS "assignments_operator_id_fkey";
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_operator_id_fkey" 
  FOREIGN KEY ("operator_id") REFERENCES "users"("id") ON UPDATE CASCADE ON DELETE RESTRICT;

-- Drop the operators table
DROP TABLE IF EXISTS "operators";

-- Drop the contractors table if it still exists (cleanup)
DROP TABLE IF EXISTS "contractors";
