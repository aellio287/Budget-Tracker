
import React from 'react';
import { Wallet, Sun, Moon, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDarkMode}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={handleLogout}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
