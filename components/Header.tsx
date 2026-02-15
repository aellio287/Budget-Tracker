
import React from 'react';
import { Wallet, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="max-w-2xl mx-auto px-4 py-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Budget Tracker
        </h1>
      </div>
      
      <button
        onClick={onToggleDarkMode}
        className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
        title="Toggle Theme"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
};
