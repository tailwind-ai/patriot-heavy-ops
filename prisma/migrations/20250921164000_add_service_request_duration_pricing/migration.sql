-- Create duration and rate type enums
CREATE TYPE "DurationType" AS ENUM ('HALF_DAY', 'FULL_DAY', 'MULTI_DAY', 'WEEKLY');
CREATE TYPE "RateType" AS ENUM ('HOURLY', 'HALF_DAY', 'DAILY', 'WEEKLY');

-- Add duration and pricing fields to service_requests table
ALTER TABLE "service_requests" ADD COLUMN "requested_duration_type" "DurationType" NOT NULL DEFAULT 'FULL_DAY';
ALTER TABLE "service_requests" ADD COLUMN "requested_duration_value" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "service_requests" ADD COLUMN "requested_total_hours" DECIMAL(10,2) NOT NULL DEFAULT 8.00;
ALTER TABLE "service_requests" ADD COLUMN "rate_type" "RateType" NOT NULL DEFAULT 'DAILY';
ALTER TABLE "service_requests" ADD COLUMN "base_rate" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
