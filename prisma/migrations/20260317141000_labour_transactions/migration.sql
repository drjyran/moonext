-- CreateEnum
CREATE TYPE "LabourPaymentCycle" AS ENUM ('DAILY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "LabourTransactionType" AS ENUM (
  'DAILY_WAGE_PAYMENT',
  'MONTHLY_SALARY_PAYMENT',
  'ADVANCE',
  'FOOD_EXPENSE',
  'MEDICAL_EXPENSE',
  'FARE',
  'MISCELLANEOUS_EXPENSE',
  'BONUS',
  'DEDUCTION',
  'ADJUSTMENT'
);

-- CreateEnum
CREATE TYPE "TransactionPaymentMode" AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "FareType" AS ENUM ('LOCAL', 'BUS', 'TRAIN', 'SITE_TRANSFER', 'AUTO_TAXI', 'OTHER');

-- AlterTable
ALTER TABLE "Labour"
ADD COLUMN "monthlyWage" DECIMAL(12,2),
ADD COLUMN "paymentCycle" "LabourPaymentCycle" NOT NULL DEFAULT 'DAILY';

-- CreateTable
CREATE TABLE "LabourTransaction" (
  "id" TEXT NOT NULL,
  "labourId" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "contractorId" TEXT NOT NULL,
  "wageRecordId" TEXT,
  "type" "LabourTransactionType" NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "paymentMode" "TransactionPaymentMode" NOT NULL DEFAULT 'CASH',
  "transactionDate" TIMESTAMP(3) NOT NULL,
  "remarks" TEXT,
  "deductibleFromWages" BOOLEAN NOT NULL DEFAULT false,
  "fareType" "FareType",
  "fromLocation" TEXT,
  "toLocation" TEXT,
  "travelDate" TIMESTAMP(3),
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LabourTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabourTransaction_wageRecordId_key" ON "LabourTransaction"("wageRecordId");

-- CreateIndex
CREATE INDEX "LabourTransaction_labourId_transactionDate_idx" ON "LabourTransaction"("labourId", "transactionDate");

-- CreateIndex
CREATE INDEX "LabourTransaction_siteId_transactionDate_idx" ON "LabourTransaction"("siteId", "transactionDate");

-- CreateIndex
CREATE INDEX "LabourTransaction_contractorId_transactionDate_idx" ON "LabourTransaction"("contractorId", "transactionDate");

-- CreateIndex
CREATE INDEX "LabourTransaction_type_transactionDate_idx" ON "LabourTransaction"("type", "transactionDate");

-- AddForeignKey
ALTER TABLE "LabourTransaction" ADD CONSTRAINT "LabourTransaction_labourId_fkey" FOREIGN KEY ("labourId") REFERENCES "Labour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourTransaction" ADD CONSTRAINT "LabourTransaction_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourTransaction" ADD CONSTRAINT "LabourTransaction_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourTransaction" ADD CONSTRAINT "LabourTransaction_wageRecordId_fkey" FOREIGN KEY ("wageRecordId") REFERENCES "WageRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourTransaction" ADD CONSTRAINT "LabourTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
