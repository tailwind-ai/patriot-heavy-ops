-- CreateEnum for ServiceRequestStatus
CREATE TYPE "ServiceRequestStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'OPERATOR_MATCHING', 'OPERATOR_ASSIGNED', 'EQUIPMENT_CHECKING', 'EQUIPMENT_CONFIRMED', 'DEPOSIT_REQUESTED', 'DEPOSIT_PENDING', 'DEPOSIT_RECEIVED', 'JOB_SCHEDULED', 'JOB_IN_PROGRESS', 'JOB_COMPLETED', 'INVOICED', 'PAYMENT_PENDING', 'PAYMENT_RECEIVED', 'CLOSED', 'CANCELLED');

-- Remove role column from users table
ALTER TABLE "users" DROP COLUMN "role";

-- Create roles table
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- Create user_roles junction table
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- Create service_request_status_history table
CREATE TABLE "service_request_status_history" (
    "id" TEXT NOT NULL,
    "service_request_id" TEXT NOT NULL,
    "from_status" "ServiceRequestStatus",
    "to_status" "ServiceRequestStatus" NOT NULL,
    "changed_by" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_request_status_history_pkey" PRIMARY KEY ("id")
);

-- Create payments table
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "service_request_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "stripe_payment_intent_id" TEXT,
    "stripe_charge_id" TEXT,
    "paid_at" TIMESTAMP(3),
    "refunded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- Update service_requests table with new fields
ALTER TABLE "service_requests" ALTER COLUMN "status" TYPE "ServiceRequestStatus" USING "status"::"ServiceRequestStatus";
ALTER TABLE "service_requests" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
ALTER TABLE "service_requests" ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'NORMAL';
ALTER TABLE "service_requests" ADD COLUMN "estimated_cost" DECIMAL(65,30);
ALTER TABLE "service_requests" ADD COLUMN "deposit_amount" DECIMAL(65,30);
ALTER TABLE "service_requests" ADD COLUMN "deposit_paid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "service_requests" ADD COLUMN "deposit_paid_at" TIMESTAMP(3);
ALTER TABLE "service_requests" ADD COLUMN "final_amount" DECIMAL(65,30);
ALTER TABLE "service_requests" ADD COLUMN "final_paid" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "service_requests" ADD COLUMN "final_paid_at" TIMESTAMP(3);
ALTER TABLE "service_requests" ADD COLUMN "stripe_deposit_payment_intent_id" TEXT;
ALTER TABLE "service_requests" ADD COLUMN "stripe_final_payment_intent_id" TEXT;
ALTER TABLE "service_requests" ADD COLUMN "assigned_manager_id" TEXT;
ALTER TABLE "service_requests" ADD COLUMN "internal_notes" TEXT;
ALTER TABLE "service_requests" RENAME COLUMN "admin_notes" TO "rejection_reason";

-- Create unique constraints
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- Add foreign key constraints
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_assigned_manager_id_fkey" FOREIGN KEY ("assigned_manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "service_request_status_history" ADD CONSTRAINT "service_request_status_history_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "service_request_status_history" ADD CONSTRAINT "service_request_status_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payments" ADD CONSTRAINT "payments_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default roles
INSERT INTO "roles" ("id", "name", "description", "permissions") VALUES
('role_user', 'USER', 'Default user who can submit service requests', '["submit_requests", "view_own_requests", "edit_own_requests"]'),
('role_operator', 'OPERATOR', 'Equipment operator who fulfills service requests', '["view_assignments", "update_availability", "manage_profile"]'),
('role_manager', 'MANAGER', 'Manager who reviews requests and handles operations', '["review_requests", "assign_operators", "track_progress", "handle_billing", "view_all_requests"]'),
('role_admin', 'ADMIN', 'System administrator with full access', '["manage_users", "manage_roles", "system_settings", "view_all_data", "manage_permissions"]');

-- Assign USER role to existing users
INSERT INTO "user_roles" ("id", "user_id", "role_id")
SELECT 
    'ur_' || u.id || '_user',
    u.id,
    'role_user'
FROM "users" u;
