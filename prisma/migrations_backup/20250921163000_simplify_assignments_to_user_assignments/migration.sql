-- Rename assignments table to user_assignments
ALTER TABLE "assignments" RENAME TO "user_assignments";

-- Remove conflicting date fields (use ServiceRequest dates instead)
ALTER TABLE "user_assignments" DROP COLUMN IF EXISTS "start_date";
ALTER TABLE "user_assignments" DROP COLUMN IF EXISTS "end_date";

-- Add new time tracking fields
ALTER TABLE "user_assignments" ADD COLUMN "estimated_hours" DECIMAL(10,2);
ALTER TABLE "user_assignments" ADD COLUMN "actual_hours" DECIMAL(10,2);

-- Add better timestamp tracking
ALTER TABLE "user_assignments" ADD COLUMN "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "user_assignments" ADD COLUMN "accepted_at" TIMESTAMP(3);
ALTER TABLE "user_assignments" ADD COLUMN "completed_at" TIMESTAMP(3);

-- Update status field to be more specific (remove 'completed' since we have completed_at)
-- Note: existing data will keep current status values
