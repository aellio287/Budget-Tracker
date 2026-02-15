
import React from 'react';
import { BudgetStats } from '../types';

interface SpendingOverviewProps {
  stats: BudgetStats;
}

function calculateBudgetPercentage(income: number, expenses: number) {
  if (income <= 0) {
    return {
      expensePercent: expenses > 0 ? 100 : 0,
      remainingPercent: 0
    };
  }
  const expensePercent = Math.min(100, (expenses / income) * 100);
  const remainingPercent = Math.max(0, 100 - expensePercent);
  return { expensePercent, remainingPercent };
}

export const SpendingOverview: React.FC<SpendingOverviewProps> = ({ stats }) => {
  const { totalIncome, totalExpense } = stats;
  const { expensePercent, remainingPercent } = calculateBudgetPercentage(totalIncome, totalExpense);
  
  const size = 200;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const renderChart = () => {
    if (totalIncome === 0 && totalExpense === 0) {
      return (
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="transparent" 
          stroke="currentColor" 
          strokeWidth={strokeWidth} 
          className="text-slate-100 dark:text-slate-800" 
        />
      );
    }

    const hasBoth = expensePercent > 0 && remainingPercent > 0;
    const visualGap = 10; 
    const mathGap = hasBoth ? (visualGap + strokeWidth) : 0;
    const totalGaps = hasBoth ? 2 : 0; 
    const availableCircumference = circumference - (totalGaps * mathGap);

    let expenseDash = (expensePercent / 100) * availableCircumference;
    let remainingDash = (remainingPercent / 100) * availableCircumference;

    return (
      <>
        {expensePercent > 0 && (
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="transparent" 
            stroke="#f43f5e" 
            strokeWidth={strokeWidth} 
            strokeDasharray={`${expenseDash} ${circumference}`} 
            strokeDashoffset={hasBoth ? -mathGap / 2 : 0} 
            strokeLinecap="round" 
            className="transition-all duration-700 ease-in-out"
          />
        )}
        {remainingPercent > 0 && (
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="transparent" 
            stroke="#10b981" 
            strokeWidth={strokeWidth} 
            strokeDasharray={`${remainingDash} ${circumference}`} 
            strokeDashoffset={hasBoth ? -(expenseDash + (mathGap * 1.5)) : 0} 
            strokeLinecap="round" 
            className="transition-all duration-700 ease-in-out"
          />
        )}
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Flow Analysis</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cash In vs Out</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="relative flex justify-center items-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {renderChart()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-4xl font-black text-slate-800 dark:text-white transition-all">{Math.round(expensePercent)}%</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Expense Ratio</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Savings Rate</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{Math.round(remainingPercent)}%</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expense Percentage</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{Math.round(expensePercent)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
