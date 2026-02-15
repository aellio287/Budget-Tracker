
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string; // Renamed from text
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface BudgetStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  budgetLimit: number;
}

export interface MonthData {
  income: number;
  budgetLimit: number;
  transactions: Transaction[];
}

export type AppStore = Record<string, MonthData>;

export interface AppState {
  monthsData: AppStore;
  recurringTransactions: any[];
  currentMonth: string;
}
