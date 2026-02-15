
import React from 'react';
import { PieChart, Info } from 'lucide-react';
import { Transaction } from '../types';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

interface BreakdownItem {
  category: string;
  totalAmount: number;
  percentage: number;
  color: string;
  tailwindColor: string;
}

const CATEGORY_CONFIG: Record<string, { color: string; tailwind: string }> = {
  'Food': { color: '#f59e0b', tailwind: 'bg-amber-500' },
  'Transport': { color: '#3b82f6', tailwind: 'bg-blue-500' },
  'Rent': { color: '#6366f1', tailwind: 'bg-indigo-500' },
  'Shopping': { color: '#ec4899', tailwind: 'bg-pink-500' },
  'Entertainment': { color: '#a855f7', tailwind: 'bg-purple-500' },
  'Health': { color: '#10b981', tailwind: 'bg-emerald-500' },
  'Utilities': { color: '#06b6d4', tailwind: 'bg-cyan-500' },
  'Other': { color: '#64748b', tailwind: 'bg-slate-500' }
};

export function calculateCategoryBreakdown(transactions: Transaction[]): BreakdownItem[] {
  const expenses = transactions.filter(t => t.type === 'expense' && t.amount > 0);
  if (expenses.length === 0) return [];
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const categoriesMap: Record<string, number> = {};
  expenses.forEach(t => {
    const cat = t.category || 'Other';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + t.amount;
  });
  return Object.entries(categoriesMap).map(([category, totalAmount]) => {
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Other'];
    return {
      category,
      totalAmount,
      percentage: Math.round((totalAmount / totalExpense) * 100),
      color: config.color,
      tailwindColor: config.tailwind
    };
  }).sort((a, b) => b.totalAmount - a.totalAmount);
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions }) => {
  const breakdown = calculateCategoryBreakdown(transactions);
  
  const size = 180;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-2xl">
          <PieChart className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Category Breakdown</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Expense Distribution</p>
        </div>
      </div>

      {breakdown.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-[1.5rem] border border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in duration-700">
           <Info className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] text-center">
             No expense data available for this month
           </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in duration-700">
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 filter drop-shadow-md">
              <circle cx={center} cy={center} r={radius} fill="transparent" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-50 dark:text-slate-800/20" />
              {(() => {
                const visualGap = 8;
                const mathGap = visualGap + strokeWidth;
                const totalGaps = breakdown.length > 1 ? breakdown.length : 0;
                const availableCircumference = circumference - (totalGaps * mathGap);
                let currentOffset = totalGaps > 1 ? -(mathGap / 2) : 0;

                return breakdown.map((item) => {
                  const dashLength = (item.percentage / 100) * availableCircumference;
                  const dashOffset = currentOffset;
                  currentOffset -= (dashLength + mathGap);
                  
                  return (
                    <circle 
                      key={item.category} 
                      cx={center} 
                      cy={center} 
                      r={radius} 
                      fill="transparent" 
                      stroke={item.color} 
                      strokeWidth={strokeWidth} 
                      strokeDasharray={`${dashLength} ${circumference}`} 
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-in-out"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white transition-all">{breakdown[0].percentage}%</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Leader</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            {breakdown.map((item) => (
              <div key={item.category} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.tailwindColor}`} />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400">{item.percentage}%</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white">
                    {new Intl.NumberFormat('en-US').format(item.totalAmount)} MMK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
