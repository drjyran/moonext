-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('FULL_TIME', 'HALF_TIME', 'OVER_TIME', 'ABSENT');

-- AlterEnum
ALTER TYPE "AttendanceStatus" ADD VALUE 'OVERTIME';

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "overtimeHours" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shiftType" "ShiftType" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "workDescription" TEXT;

-- AlterTable
ALTER TABLE "Labour" ADD COLUMN     "halfDayWage" DECIMAL(10,2),
ADD COLUMN     "overtimeWage" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "WageRecord" ADD COLUMN     "fullTimeDays" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "fullTimePay" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "halfTimeDays" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "halfTimePay" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "overtimeHours" DECIMAL(6,2) NOT NULL DEFAULT 0,
ADD COLUMN     "overtimePay" DECIMAL(10,2) NOT NULL DEFAULT 0;
