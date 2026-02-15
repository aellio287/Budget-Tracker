
import React, { useState } from 'react';
import { Filter, X, Calendar as CalendarIcon, CheckCircle2, RotateCcw } from 'lucide-react';

export interface FilterState {
  startDate: string;
  endDate: string;
  month: string;
  year: string;
}

interface FilterControlsProps {
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ onApply, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    month: '',
    year: ''
  });

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = [
    { val: '01', label: 'January' }, { val: '02', label: 'February' }, { val: '03', label: 'March' },
    { val: '04', label: 'April' }, { val: '05', label: 'May' }, { val: '06', label: 'June' },
    { val: '07', label: 'July' }, { val: '08', label: 'August' }, { val: '09', label: 'September' },
    { val: '10', label: 'October' }, { val: '11', label: 'November' }, { val: '12', label: 'December' }
  ];

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({ startDate: '', endDate: '', month: '', year: '' });
    onReset();
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${
          isOpen 
          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        <div className="flex items-center gap-3">
          <Filter className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-indigo-500'}`} />
          <span className="font-black text-sm uppercase tracking-widest">Advanced Filters</span>
        </div>
        {isOpen ? <X className="w-5 h-5" /> : <CalendarIcon className="w-5 h-5 opacity-50" />}
      </button>

      {isOpen && (
        <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Date Range Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specific Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 ml-1">START</span>
                  <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 ml-1">END</span>
                  <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Selection Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Select</label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={filters.month}
                  onChange={(e) => setFilters({...filters, month: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white appearance-none"
                >
                  <option value="">Any Month</option>
                  {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                </select>
                <select 
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white appearance-none"
                >
                  <option value="">Any Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
            <button 
              onClick={handleApply}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" /> Apply Filter
            </button>
            <button 
              onClick={handleReset}
              className="px-8 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
