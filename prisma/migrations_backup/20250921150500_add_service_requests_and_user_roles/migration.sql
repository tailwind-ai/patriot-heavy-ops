-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CONTRACTOR', 'OPERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "TransportOption" AS ENUM ('WE_HANDLE_IT', 'YOU_HANDLE_IT');

-- CreateEnum
CREATE TYPE "EquipmentCategory" AS ENUM ('SKID_STEERS_TRACK_LOADERS', 'FRONT_END_LOADERS', 'BACKHOES_EXCAVATORS', 'BULLDOZERS', 'GRADERS', 'DUMP_TRUCKS', 'WATER_TRUCKS', 'SWEEPERS', 'TRENCHERS');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'CONTRACTOR';
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "company" TEXT;

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN "service_request_id" TEXT;
ALTER TABLE "assignments" ALTER COLUMN "project_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "company" TEXT,
    "job_site" TEXT NOT NULL,
    "transport" "TransportOption" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "equipment_category" "EquipmentCategory" NOT NULL,
    "equipment_detail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
