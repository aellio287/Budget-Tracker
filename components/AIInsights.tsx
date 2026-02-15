
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, Lightbulb, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { getBudgetInsights } from '../services/geminiService';
import { generateFinancialInsights, CategoryData } from '../services/financialAnalyzer';
import { calculateCategoryBreakdown } from './CategoryBreakdown';
import { Transaction } from '../types';

interface AIInsightsProps {
  transactions: Transaction[];
  income: number;
  expenses: number;
  budgetLimit: number;
  previousMonthData?: { income: number; expenses: number };
}

export const AIInsights: React.FC<AIInsightsProps> = ({ 
  transactions, 
  income, 
  expenses, 
  budgetLimit,
  previousMonthData 
}) => {
  const [aiTip, setAiTip] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const categoryBreakdown: CategoryData[] = useMemo(() => 
    calculateCategoryBreakdown(transactions), 
    [transactions]
  );

  const insights = useMemo(() => {
    setIsUpdating(true);
    const result = generateFinancialInsights(income, expenses, budgetLimit, categoryBreakdown, previousMonthData);
    setTimeout(() => setIsUpdating(false), 500);
    return result;
  }, [income, expenses, budgetLimit, categoryBreakdown, previousMonthData]);

  const fetchAiTip = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    try {
      const tip = await getBudgetInsights(transactions);
      setAiTip(tip);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiTip();
  }, [transactions.length > 0 && transactions[0].id]);

  // Hidden until there's data to analyze
  if (transactions.length === 0) {
    return null;
  }

  const riskStyles = {
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    High: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800"
  };

  return (
    <div className={`transition-all duration-500 ease-in-out ${isUpdating ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}`}>
      <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        
        {/* Header with Risk Badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Spending Analysis</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Calculated Monthly Insights</p>
            </div>
          </div>
          
          <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 transition-colors ${riskStyles[insights.riskLevel]}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${insights.riskLevel === 'High' ? 'bg-rose-400' : insights.riskLevel === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${insights.riskLevel === 'High' ? 'bg-rose-500' : insights.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            {insights.riskLevel} Risk
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Summary Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                    <Info className="w-5 h-5 text-indigo-500" />
                  </div>
                </div>
                <p className="text-base font-black text-slate-800 dark:text-slate-100 leading-relaxed">
                  {insights.summary}
                </p>
              </div>
            </div>
          </div>

          {/* AI Tip Integration */}
          {aiTip && (
            <div className="p-5 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 rounded-3xl text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-20 h-20 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Smart Advisor Tip</span>
                </div>
                <p className="text-sm font-bold leading-relaxed opacity-95">"{aiTip}"</p>
                <button 
                  onClick={fetchAiTip} 
                  disabled={loading}
                  className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Intelligence
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Warnings Section */}
            {insights.warnings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <AlertTriangle className="w-3 h-3 text-rose-500" /> Potential Flags
                </h4>
                <div className="space-y-2">
                  {insights.warnings.map((w, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100/50 dark:border-rose-900/30 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                      <p className="text-sm font-bold text-rose-800 dark:text-rose-300 leading-tight">{w}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {insights.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Suggested Actions
                </h4>
                <div className="space-y-2">
                  {insights.recommendations.map((r, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 leading-tight">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
