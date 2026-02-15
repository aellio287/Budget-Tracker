
import React, { useEffect, useState } from 'react';
import { Heart, TrendingUp, ShieldAlert, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface FinancialHealthProps {
  income: number;
  expenses: number;
  budgetLimit: number;
}

export function calculateFinancialHealth(income: number, expenses: number, budgetLimit: number) {
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  
  let score = 0;
  if (savingsRate >= 30) score = 100;
  else if (savingsRate >= 20) score = 80;
  else if (savingsRate >= 10) score = 60;
  else if (savingsRate >= 0) score = 40;
  else score = 10;

  if (budgetLimit > 0 && expenses > budgetLimit) score = Math.max(0, score - 20);

  let status = "";
  let colorClass = "";
  let ringColor = "";
  let bgColor = "";
  let Icon = AlertCircle;

  if (score >= 80) {
    status = "Excellent";
    colorClass = "text-emerald-500";
    ringColor = "#10b981";
    bgColor = "bg-emerald-500/10";
    Icon = CheckCircle2;
  } else if (score >= 60) {
    status = "Good";
    colorClass = "text-lime-500";
    ringColor = "#84cc16";
    bgColor = "bg-lime-500/10";
    Icon = TrendingUp;
  } else if (score >= 40) {
    status = "Average";
    colorClass = "text-amber-500";
    ringColor = "#f59e0b";
    bgColor = "bg-amber-500/10";
    Icon = AlertCircle;
  } else {
    status = "Critical";
    colorClass = "text-rose-500";
    ringColor = "#f43f5e";
    bgColor = "bg-rose-500/10";
    Icon = ShieldAlert;
  }

  return { savings, savingsRate: Math.round(savingsRate), score, status, colorClass, ringColor, bgColor, Icon };
}

export const FinancialHealth: React.FC<FinancialHealthProps> = ({ income, expenses, budgetLimit }) => {
  const { savings, savingsRate, score, status, colorClass, ringColor, bgColor, Icon } = calculateFinancialHealth(income, expenses, budgetLimit);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  if (income === 0 && expenses === 0) return null;

  const circumference = 2 * Math.PI * 54; // Restored radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`${bgColor} p-3 rounded-2xl`}>
            <Zap className={`w-6 h-6 ${colorClass}`} fill="currentColor" fillOpacity={0.2} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Financial Health</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time status</p>
          </div>
        </div>
        <div className={`px-4 py-2 ${bgColor} rounded-full border border-current border-opacity-20 flex items-center gap-2`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
          <span className={`font-black uppercase text-xs tracking-widest ${colorClass}`}>{status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Score Gauge */}
        <div className="flex justify-center p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="54" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-200 dark:text-slate-800" />
              <circle cx="80" cy="80" r="54" fill="transparent" stroke={ringColor} strokeWidth="12" strokeDasharray={circumference} style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black ${colorClass}`}>{score}</span>
              <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Score</span>
            </div>
          </div>
        </div>

        {/* Savings Stats */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Monthly Surplus</p>
            <p className={`text-3xl font-black ${savings >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-500'}`}>
              {new Intl.NumberFormat('en-US').format(savings)} <span className="text-lg opacity-50">MMK</span>
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Savings Rate</span>
              <span className="font-black text-lg text-slate-700 dark:text-slate-300">{savingsRate}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 p-1">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(5, Math.min(100, savingsRate))}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
