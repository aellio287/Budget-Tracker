
import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BudgetStats } from '../types';

interface BalanceCardProps {
  stats: BudgetStats;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' MMK';
  };

  return (
    <div className="space-y-6">
      {/* Total Balance Hero Card */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-10 text-white border border-slate-800 shadow-md transition-all">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-black mb-2 uppercase tracking-[0.2em]">Available Balance</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">
            {formatCurrency(stats.balance)}
          </h2>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -mr-20 -mt-20" />
        <Wallet className="absolute -bottom-6 -right-6 w-48 h-48 text-white/[0.03] rotate-12" />
      </div>

      {/* Income & Expense Split Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
              <ArrowUpRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Income</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl">
              <ArrowDownRight className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Expenses</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100">
                {formatCurrency(stats.totalExpense)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
