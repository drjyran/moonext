export const labourPaymentCycles = ["DAILY", "MONTHLY"] as const;
export type LabourPaymentCycleValue = typeof labourPaymentCycles[number];

export const labourTransactionTypes = [
  "DAILY_WAGE_PAYMENT",
  "MONTHLY_SALARY_PAYMENT",
  "ADVANCE",
  "FOOD_EXPENSE",
  "MEDICAL_EXPENSE",
  "FARE",
  "MISCELLANEOUS_EXPENSE",
  "BONUS",
  "DEDUCTION",
  "ADJUSTMENT"
] as const;
export type LabourTransactionTypeValue = typeof labourTransactionTypes[number];

export const manualLabourTransactionTypes = [
  "ADVANCE",
  "FOOD_EXPENSE",
  "MEDICAL_EXPENSE",
  "FARE",
  "MISCELLANEOUS_EXPENSE",
  "BONUS",
  "DEDUCTION",
  "ADJUSTMENT"
] as const;
export type ManualLabourTransactionTypeValue = typeof manualLabourTransactionTypes[number];

export const transactionPaymentModes = ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "CARD", "OTHER"] as const;
export type TransactionPaymentModeValue = typeof transactionPaymentModes[number];

export const fareTypes = ["LOCAL", "BUS", "TRAIN", "SITE_TRANSFER", "AUTO_TAXI", "OTHER"] as const;
export type FareTypeValue = typeof fareTypes[number];

type LabourTransactionLike = {
  type: LabourTransactionTypeValue;
  amount: unknown;
  deductibleFromWages: boolean;
  transactionDate?: string | Date;
  createdAt?: string | Date;
};

type WageLike = {
  grossAmount: unknown;
};

export type LabourSettlementSummary = {
  totalEarnedWages: number;
  totalWagePayments: number;
  totalAdvances: number;
  deductibleAdvances: number;
  totalFoodExpenses: number;
  deductibleFoodExpenses: number;
  totalMedicalExpenses: number;
  deductibleMedicalExpenses: number;
  totalFare: number;
  deductibleFare: number;
  totalMiscExpenses: number;
  deductibleMiscExpenses: number;
  totalBonus: number;
  totalDeductions: number;
  totalAdjustments: number;
  deductibleAdjustments: number;
  creditAdjustments: number;
  deductibleTotal: number;
  nonDeductibleExpenseTotal: number;
  grossSettlement: number;
  netPayable: number;
  pendingAmount: number;
  overpaidAmount: number;
};

export const labourTransactionLabels: Record<LabourTransactionTypeValue, string> = {
  DAILY_WAGE_PAYMENT: "Daily Wage Payment",
  MONTHLY_SALARY_PAYMENT: "Monthly Salary Payment",
  ADVANCE: "Advance",
  FOOD_EXPENSE: "Food Expense",
  MEDICAL_EXPENSE: "Medical Expense",
  FARE: "Fare / Travel",
  MISCELLANEOUS_EXPENSE: "Miscellaneous",
  BONUS: "Bonus",
  DEDUCTION: "Deduction",
  ADJUSTMENT: "Adjustment"
};

export const defaultDeductibleByTransactionType: Record<ManualLabourTransactionTypeValue, boolean> = {
  ADVANCE: true,
  FOOD_EXPENSE: true,
  MEDICAL_EXPENSE: false,
  FARE: false,
  MISCELLANEOUS_EXPENSE: false,
  BONUS: false,
  DEDUCTION: true,
  ADJUSTMENT: true
};

export const transactionPaymentModeLabels: Record<TransactionPaymentModeValue, string> = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CHEQUE: "Cheque",
  CARD: "Card",
  OTHER: "Other"
};

export const fareTypeLabels: Record<FareTypeValue, string> = {
  LOCAL: "Local",
  BUS: "Bus",
  TRAIN: "Train",
  SITE_TRANSFER: "Site Transfer",
  AUTO_TAXI: "Auto / Taxi",
  OTHER: "Other"
};

export function getPaymentCycleLabel(value: LabourPaymentCycleValue) {
  return value === "MONTHLY" ? "Monthly Salary" : "Daily Wage";
}

export function getTransactionLabel(type: LabourTransactionTypeValue) {
  return labourTransactionLabels[type];
}

export function getPaymentModeLabel(mode: TransactionPaymentModeValue) {
  return transactionPaymentModeLabels[mode];
}

export function getFareTypeLabel(type: FareTypeValue) {
  return fareTypeLabels[type];
}

export function getMonthDateRange(month: number, year: number) {
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 1)
  };
}

export function sortTransactionsAscending<T extends LabourTransactionLike>(transactions: T[]) {
  return [...transactions].sort((a, b) => {
    const dateDiff = new Date(a.transactionDate || 0).getTime() - new Date(b.transactionDate || 0).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });
}

export function getTransactionSettlementImpact(transaction: LabourTransactionLike) {
  const amount = Number(transaction.amount || 0);

  switch (transaction.type) {
    case "DAILY_WAGE_PAYMENT":
    case "MONTHLY_SALARY_PAYMENT":
      return -amount;
    case "BONUS":
      return amount;
    case "ADVANCE":
    case "FOOD_EXPENSE":
    case "MEDICAL_EXPENSE":
    case "FARE":
    case "MISCELLANEOUS_EXPENSE":
    case "DEDUCTION":
      return transaction.deductibleFromWages ? -amount : 0;
    case "ADJUSTMENT":
      return transaction.deductibleFromWages ? -amount : amount;
    default:
      return 0;
  }
}

export function buildLabourSettlementSummary<TWage extends WageLike, TTransaction extends LabourTransactionLike>(
  wages: TWage[],
  transactions: TTransaction[]
): LabourSettlementSummary {
  const summary: LabourSettlementSummary = {
    totalEarnedWages: wages.reduce((sum, wage) => sum + Number(wage.grossAmount || 0), 0),
    totalWagePayments: 0,
    totalAdvances: 0,
    deductibleAdvances: 0,
    totalFoodExpenses: 0,
    deductibleFoodExpenses: 0,
    totalMedicalExpenses: 0,
    deductibleMedicalExpenses: 0,
    totalFare: 0,
    deductibleFare: 0,
    totalMiscExpenses: 0,
    deductibleMiscExpenses: 0,
    totalBonus: 0,
    totalDeductions: 0,
    totalAdjustments: 0,
    deductibleAdjustments: 0,
    creditAdjustments: 0,
    deductibleTotal: 0,
    nonDeductibleExpenseTotal: 0,
    grossSettlement: 0,
    netPayable: 0,
    pendingAmount: 0,
    overpaidAmount: 0
  };

  for (const transaction of transactions) {
    const amount = Number(transaction.amount || 0);

    switch (transaction.type) {
      case "DAILY_WAGE_PAYMENT":
      case "MONTHLY_SALARY_PAYMENT":
        summary.totalWagePayments += amount;
        break;
      case "ADVANCE":
        summary.totalAdvances += amount;
        if (transaction.deductibleFromWages) summary.deductibleAdvances += amount;
        else summary.nonDeductibleExpenseTotal += amount;
        break;
      case "FOOD_EXPENSE":
        summary.totalFoodExpenses += amount;
        if (transaction.deductibleFromWages) summary.deductibleFoodExpenses += amount;
        else summary.nonDeductibleExpenseTotal += amount;
        break;
      case "MEDICAL_EXPENSE":
        summary.totalMedicalExpenses += amount;
        if (transaction.deductibleFromWages) summary.deductibleMedicalExpenses += amount;
        else summary.nonDeductibleExpenseTotal += amount;
        break;
      case "FARE":
        summary.totalFare += amount;
        if (transaction.deductibleFromWages) summary.deductibleFare += amount;
        else summary.nonDeductibleExpenseTotal += amount;
        break;
      case "MISCELLANEOUS_EXPENSE":
        summary.totalMiscExpenses += amount;
        if (transaction.deductibleFromWages) summary.deductibleMiscExpenses += amount;
        else summary.nonDeductibleExpenseTotal += amount;
        break;
      case "BONUS":
        summary.totalBonus += amount;
        break;
      case "DEDUCTION":
        summary.totalDeductions += amount;
        break;
      case "ADJUSTMENT":
        summary.totalAdjustments += amount;
        if (transaction.deductibleFromWages) summary.deductibleAdjustments += amount;
        else summary.creditAdjustments += amount;
        break;
    }
  }

  summary.deductibleTotal =
    summary.deductibleAdvances +
    summary.deductibleFoodExpenses +
    summary.deductibleMedicalExpenses +
    summary.deductibleFare +
    summary.deductibleMiscExpenses +
    summary.totalDeductions +
    summary.deductibleAdjustments;

  summary.grossSettlement = summary.totalEarnedWages + summary.totalBonus + summary.creditAdjustments;
  summary.netPayable = Math.max(summary.grossSettlement - summary.deductibleTotal, 0);
  summary.pendingAmount = Math.max(summary.netPayable - summary.totalWagePayments, 0);
  summary.overpaidAmount = Math.max(summary.totalWagePayments - summary.netPayable, 0);

  return summary;
}

export function addRunningBalances<T extends LabourTransactionLike>(transactions: T[]) {
  let runningBalance = 0;

  return sortTransactionsAscending(transactions).map((transaction) => {
    runningBalance += getTransactionSettlementImpact(transaction);

    return {
      ...transaction,
      runningBalance
    };
  });
}
