
import React from 'react';
import { BarChart3, Activity, PieChart, Star } from 'lucide-react';
import { Transaction, BudgetStats } from '../types';

interface SpendingDetailsProps {
  transactions: Transaction[];
  stats: BudgetStats;
  isFiltered: boolean;
}

export const SpendingDetails: React.FC<SpendingDetailsProps> = ({ transactions, stats }) => {
  if (transactions.length === 0) return null;

  const expenses = transactions.filter(t => t.type === 'expense');
  const highestTransaction = [...expenses].sort((a, b) => b.amount - a.amount)[0];
  
  const catTotals: Record<string, number> = {};
  expenses.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  const formatMMK = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Monthly Analysis</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Full Period Overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${stats.balance >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
              <Activity className={`w-4 h-4 ${stats.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Savings</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${stats.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatMMK(stats.balance)}
            </span>
            <span className="text-[10px] font-bold opacity-40">MMK</span>
          </div>
        </div>

        {topCategory && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <PieChart className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Category</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800 dark:text-white truncate max-w-[120px]">
                {topCategory[0]}
              </span>
              <span className="text-[10px] font-bold text-slate-400">({formatMMK(topCategory[1])})</span>
            </div>
          </div>
        )}

        {highestTransaction && (
          <div className="sm:col-span-2 p-6 bg-slate-900 dark:bg-slate-950 rounded-3xl relative overflow-hidden transition-transform hover:scale-[1.01]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly High Record</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-black text-white">{highestTransaction.title}</h4>
                  <p className="text-xs font-bold text-indigo-400 mt-1 uppercase tracking-tighter">
                    {highestTransaction.category} • {new Date(highestTransaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-500">{formatMMK(highestTransaction.amount)}</span>
                  <span className="text-xs font-bold text-rose-500/40">MMK</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
