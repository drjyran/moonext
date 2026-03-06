-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SITE_MANAGER', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "LabourStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'HALF_DAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "siteId" TEXT,
    "contractorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "projectStart" TIMESTAMP(3) NOT NULL,
    "projectEnd" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "siteManagerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contractor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labour" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "skillType" TEXT NOT NULL,
    "dailyWage" DECIMAL(10,2) NOT NULL,
    "status" "LabourStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedSiteId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "aadhaarDocUrl" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Labour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "labourId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WageRecord" (
    "id" TEXT NOT NULL,
    "labourId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "presentDays" DECIMAL(5,2) NOT NULL,
    "grossAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pendingAmount" DECIMAL(10,2) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Contractor_phone_key" ON "Contractor"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Contractor_email_key" ON "Contractor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Labour_phone_key" ON "Labour"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Labour_aadhaarNumber_key" ON "Labour"("aadhaarNumber");

-- CreateIndex
CREATE INDEX "Attendance_siteId_date_idx" ON "Attendance"("siteId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_labourId_date_key" ON "Attendance"("labourId", "date");

-- CreateIndex
CREATE INDEX "WageRecord_siteId_month_year_idx" ON "WageRecord"("siteId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "WageRecord_labourId_month_year_key" ON "WageRecord"("labourId", "month", "year");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Labour" ADD CONSTRAINT "Labour_assignedSiteId_fkey" FOREIGN KEY ("assignedSiteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Labour" ADD CONSTRAINT "Labour_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_labourId_fkey" FOREIGN KEY ("labourId") REFERENCES "Labour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WageRecord" ADD CONSTRAINT "WageRecord_labourId_fkey" FOREIGN KEY ("labourId") REFERENCES "Labour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WageRecord" ADD CONSTRAINT "WageRecord_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WageRecord" ADD CONSTRAINT "WageRecord_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
