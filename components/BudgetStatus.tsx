
import React, { useState } from 'react';
import { Target, Check, X, PlusCircle } from 'lucide-react';

interface BudgetStatusProps {
  expenses: number;
  budgetLimit: number;
  onLimitChange: (limit: number) => void;
}

export function calculateBudgetStatus(expenses: number, budgetLimit: number) {
  if (!budgetLimit || budgetLimit <= 0) return { budgetPercent: 0, remainingBudget: 0, status: "Not Set", color: "#94a3b8" };
  const budgetPercent = (expenses / budgetLimit) * 100;
  const remainingBudget = budgetLimit - expenses;
  let status = "";
  let color = "";
  
  if (expenses > budgetLimit) { status = "Over Limit"; color = "#f43f5e"; }
  else if (budgetPercent >= 80) { status = "Warning"; color = "#f43f5e"; }
  else { status = "On Track"; color = "#10b981"; }
  
  return { budgetPercent: Math.min(budgetPercent, 100), remainingBudget, status, color };
}

export const BudgetStatus: React.FC<BudgetStatusProps> = ({ expenses, budgetLimit, onLimitChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(budgetLimit > 0 ? new Intl.NumberFormat('en-US').format(budgetLimit) : '');
  const { budgetPercent, remainingBudget, status, color } = calculateBudgetStatus(expenses, budgetLimit);

  const formatInputValue = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('en-US').format(parseInt(numeric));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempLimit(formatInputValue(e.target.value));
  };

  const handleSave = () => {
    const val = parseFloat(tempLimit.replace(/[^0-9.]/g, ''));
    if (!isNaN(val)) { 
      onLimitChange(val); 
      setIsEditing(false); 
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Monthly Budget</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Budget Goal</p>
          </div>
        </div>
        
        {!isEditing && (
          <button 
            onClick={() => { 
              setTempLimit(budgetLimit > 0 ? new Intl.NumberFormat('en-US').format(budgetLimit) : ''); 
              setIsEditing(true); 
            }} 
            className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest border ${
              budgetLimit === 0 
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 flex items-center gap-2' 
              : 'text-blue-600 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20'
            }`}
          >
            {budgetLimit === 0 && <PlusCircle className="w-3.5 h-3.5" />}
            {budgetLimit === 0 ? "Set Budget" : "Update"}
          </button>
        )}
        
        {isEditing && (
          <div className="flex items-center gap-2 animate-in fade-in duration-300">
            <input 
              type="text" 
              inputMode="numeric"
              placeholder="Enter limit"
              value={tempLimit} 
              onChange={handleInputChange} 
              className="w-32 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none" 
              autoFocus 
            />
            <button onClick={handleSave} className="p-2 bg-emerald-500 text-white rounded-xl"><Check className="w-4 h-4" /></button>
            <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-xl"><X className="w-4 h-4" /></button>
          </div>
        )}
      </div>

      {budgetLimit === 0 && !isEditing ? (
        <div className="py-6 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center animate-in fade-in duration-700">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            Set your monthly budget to track your spending progress against your goals.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{status}</p>
               <p className="text-4xl font-black text-slate-800 dark:text-white">
                 {budgetLimit > 0 ? `${Math.round((expenses / budgetLimit) * 100)}%` : '—'}
               </p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available</p>
               <p className={`text-2xl font-black ${remainingBudget < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>
                 {budgetLimit > 0 ? new Intl.NumberFormat().format(Math.abs(remainingBudget)) : '0'} <span className="text-xs opacity-40">MMK</span>
               </p>
            </div>
          </div>
          
          <div className="h-4 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 relative">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-in-out" 
              style={{ width: `${budgetPercent}%`, backgroundColor: color }} 
            />
          </div>

          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
             <span>Limit: {new Intl.NumberFormat().format(budgetLimit)}</span>
             <span>Spent: {new Intl.NumberFormat().format(expenses)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
