
import React from 'react';
import { Trash2, ArrowUpRight, ArrowDownRight, Tag, Calendar } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#1e293b] rounded-[2rem] border border-slate-100 dark:border-slate-800">
        <p className="text-slate-400 dark:text-slate-500 font-medium">No activity matching your current selection.</p>
      </div>
    );
  }

  // Group transactions by Date String (YYYY-MM-DD)
  const groupedTransactions = transactions.reduce((groups: Record<string, Transaction[]>, transaction) => {
    const dateKey = new Date(transaction.date).toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  const formatHeaderDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' MMK';
  };

  return (
    <div className="space-y-10">
      {sortedDates.map((dateKey) => (
        <div key={dateKey} className="space-y-4">
          {/* Date Header */}
          <div className="flex items-center gap-3 px-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              {formatHeaderDate(dateKey)}
            </span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800/50" />
          </div>

          <div className="space-y-3">
            {groupedTransactions[dateKey].map((transaction) => (
              <div 
                key={transaction.id} 
                className="group relative bg-white dark:bg-[#1e293b] rounded-[1.5rem] p-5 flex items-center justify-between border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0 mr-2">
                  <div className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-2xl ${
                    transaction.type === 'income' 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight truncate">{transaction.title}</p>
                      <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase rounded-md flex items-center gap-1 flex-shrink-0">
                        <Tag className="w-2.5 h-2.5" />
                        {transaction.category}
                      </span>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`font-black text-lg ${
                    transaction.type === 'income' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(transaction.id);
                    }}
                    className="p-2.5 text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all active:scale-90"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
