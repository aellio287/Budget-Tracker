
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { SpendingOverview } from './components/SpendingOverview';
import { BudgetStatus } from './components/BudgetStatus';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { MonthSelector } from './components/MonthSelector';
import { EmptyState } from './components/EmptyState';
import { AlertCircle } from 'lucide-react';
import { Transaction, BudgetStats, AppStore, MonthData, AppState } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from './services/storage';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('smart_budget_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });

  const persistedState = useMemo(() => loadFromLocalStorage(), []);

  const [currentMonth, setCurrentMonth] = useState<string>(
    persistedState?.currentMonth || new Date().toISOString().slice(0, 7)
  );

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [store, setStore] = useState<AppStore>(persistedState?.monthsData || {});

  useEffect(() => {
    const stateToPersist: AppState = {
      monthsData: store,
      recurringTransactions: [],
      currentMonth
    };
    saveToLocalStorage(stateToPersist);
  }, [store, currentMonth]);

  useEffect(() => {
    localStorage.setItem('smart_budget_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const activeData = useMemo<MonthData>(() => {
    return store[currentMonth] || { income: 0, budgetLimit: 0, transactions: [] };
  }, [store, currentMonth]);

  // 1. MONTHLY TRANSACTIONS (Base for Totals & Charts)
  const monthlyTransactions = useMemo(() => activeData.transactions, [activeData.transactions]);

  // 2. FILTERED TRANSACTIONS (For Display Timeline Only - respects Day Scroller)
  const filteredTransactions = useMemo(() => {
    let result = [...monthlyTransactions];
    if (selectedDay !== null) {
      result = result.filter(t => new Date(t.date).getDate() === selectedDay);
    }
    return result;
  }, [monthlyTransactions, selectedDay]);

  // 3. MONTHLY STATS (Always Monthly Balance)
  const monthlyStats = useMemo<BudgetStats>(() => {
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      budgetLimit: activeData.budgetLimit
    };
  }, [monthlyTransactions, activeData.budgetLimit]);

  const updateMonthData = (updates: Partial<MonthData>) => {
    setStore(prev => ({
      ...prev,
      [currentMonth]: {
        ...(prev[currentMonth] || { income: 0, budgetLimit: 0, transactions: [] }),
        ...updates
      }
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    const now = new Date();
    const [year, month] = currentMonth.split('-').map(Number);
    // Use selected day if active, otherwise use today's actual day
    const dayToUse = selectedDay || (isActualCurrentMonth ? now.getDate() : 1);
    
    const transactionDate = new Date(year, month - 1, dayToUse, now.getHours(), now.getMinutes(), now.getSeconds());
    
    const newTransactionWithFixedDate = {
      ...transaction,
      date: transactionDate.toISOString()
    };

    const newTransactions = [newTransactionWithFixedDate, ...activeData.transactions];
    updateMonthData({ transactions: newTransactions });
  };

  const isActualCurrentMonth = new Date().toISOString().slice(0, 7) === currentMonth;

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300 font-sans">
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
      />
      
      <main className="max-w-2xl mx-auto px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <MonthSelector 
          currentMonth={currentMonth} 
          selectedDay={selectedDay}
          onMonthChange={setCurrentMonth} 
          onDayChange={setSelectedDay}
        />
        
        {/* TOTALS: Always uses monthlyStats */}
        <BalanceCard stats={monthlyStats} />

        <BudgetStatus 
          expenses={monthlyStats.totalExpense} 
          budgetLimit={monthlyStats.budgetLimit} 
          onLimitChange={(val) => updateMonthData({ budgetLimit: val })}
        />

        {monthlyTransactions.length > 0 ? (
          <>
            <SpendingOverview stats={monthlyStats} />
            <CategoryBreakdown transactions={monthlyTransactions} />
          </>
        ) : (
          <EmptyState 
            title="No Activity" 
            subtitle="Start by adding your first transaction for this month." 
            type="transactions"
          />
        )}

        <TransactionForm onAdd={addTransaction} />

        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {selectedDay ? `Activity: Day ${selectedDay}` : 'Monthly Timeline'}
            </h2>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
              {filteredTransactions.length} Items
            </span>
          </div>
          
          {/* HISTORY: Only section affected by selectedDay scroller */}
          {filteredTransactions.length > 0 ? (
            <TransactionList 
              transactions={filteredTransactions} 
              onDelete={(id) => updateMonthData({ transactions: activeData.transactions.filter(t => t.id !== id) })} 
            />
          ) : (
            <EmptyState 
              title={selectedDay ? "No activity on this day" : "No activity this month"}
              subtitle={selectedDay ? "Select 'All' to see the whole month or add a new transaction." : "Add a transaction to see it in your timeline."}
              type="transactions"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
