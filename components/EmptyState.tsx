
import React from 'react';
import { LayoutList, PieChart, Wallet } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  type?: 'transactions' | 'chart' | 'budget';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle, type = 'transactions' }) => {
  const icons = {
    transactions: <LayoutList className="w-12 h-12 text-slate-300 dark:text-slate-600" />,
    chart: <PieChart className="w-12 h-12 text-slate-300 dark:text-slate-600" />,
    budget: <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600" />
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-full">
        {icons[type]}
      </div>
      <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm font-medium text-slate-400 dark:text-slate-500 max-w-[240px]">
        {subtitle}
      </p>
    </div>
  );
};
