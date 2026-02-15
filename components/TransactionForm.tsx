
import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
}

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Rent', 'Shopping', 'Health', 'Other'];

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState(''); 
  const [displayAmount, setDisplayAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(''); // Default to empty for reset logic
  const amountInputRef = useRef<HTMLInputElement>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) { 
      setDisplayAmount(''); 
      return; 
    }
    setDisplayAmount(new Intl.NumberFormat('en-US').format(parseInt(digits)));
  };

  const handleCategoryClick = (cat: string) => {
    setCategory(cat);
    setTitle(cat);
    // Automatically focus the amount input for faster entry
    setTimeout(() => amountInputRef.current?.focus(), 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(displayAmount.replace(/[^0-9]/g, ''));
    
    if (!title.trim() || isNaN(numericValue) || numericValue <= 0) {
      alert('Please enter a title and a valid amount.');
      return;
    }
    
    const uniqueId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    onAdd({
      id: uniqueId,
      title,
      amount: numericValue,
      type,
      category: category || 'Other',
      date: new Date().toISOString()
    });
    
    // Clear everything and reset selection
    setTitle('');
    setDisplayAmount('');
    setCategory('');
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Quick Entry</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Add New Transaction</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type Selector */}
        <div className="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-[1.25rem] border border-slate-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={() => { setType('income'); setCategory(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
              type === 'income' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-700' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Income
          </button>
          <button 
            type="button" 
            onClick={() => { setType('expense'); setCategory(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
              type === 'expense' 
              ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm border border-slate-100 dark:border-slate-700' 
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Expense
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
              <button 
                key={cat} 
                type="button" 
                onClick={() => handleCategoryClick(cat)}
                className={`px-5 py-3 rounded-xl text-sm font-black border transition-all ${
                  category === cat 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-500 hover:border-blue-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">Description</label>
            <input 
              type="text" 
              placeholder="What was this for?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-6 py-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-lg font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:font-medium placeholder:text-slate-400" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">Amount</label>
            <div className="relative">
              <input 
                ref={amountInputRef} 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                value={displayAmount} 
                onChange={handleAmountChange} 
                className="w-full pl-6 pr-20 py-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-lg font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:font-medium placeholder:text-slate-400" 
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none tracking-widest">
                MMK
              </span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={`w-full py-6 rounded-2xl text-xl font-black transition-all active:scale-[0.98] text-white shadow-md ${
            type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
          }`}
        >
          Confirm Entry
        </button>
      </form>
    </div>
  );
};
