-- Remove foreign key constraints first
ALTER TABLE "assignments" DROP CONSTRAINT IF EXISTS "assignments_project_id_fkey";

-- Drop project_id column from assignments table
ALTER TABLE "assignments" DROP COLUMN IF EXISTS "project_id";

-- Make service_request_id required in assignments
ALTER TABLE "assignments" ALTER COLUMN "service_request_id" SET NOT NULL;

-- Drop the projects and contractors tables
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "contractors";
