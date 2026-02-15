
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, ChevronDown, ListFilter, CalendarDays } from 'lucide-react';

interface MonthSelectorProps {
  currentMonth: string;
  selectedDay: number | null;
  onMonthChange: (month: string) => void;
  onDayChange: (day: number | null) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  currentMonth, 
  selectedDay, 
  onMonthChange, 
  onDayChange 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [yearStr, monthStr] = currentMonth.split('-');
  const date = new Date(parseInt(yearStr), parseInt(monthStr) - 1);
  const monthName = date.toLocaleString('default', { month: 'long' });
  const yearName = date.getFullYear();

  // Calculate days in month
  const lastDayDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const totalDays = lastDayDate.getDate();
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth();
  const currentDay = today.getDate();

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentMonth]);

  // Scroll active day into view
  useEffect(() => {
    if (selectedDay && scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-day="${selectedDay}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDay, currentMonth]);

  const navigateMonth = (delta: number) => {
    setDirection(delta > 0 ? 'right' : 'left');
    const newDate = new Date(date.getFullYear(), date.getMonth() + delta, 1);
    onDayChange(null); // Reset day filter on month change
    onMonthChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const getDayName = (day: number) => {
    return new Date(date.getFullYear(), date.getMonth(), day).toLocaleString('default', { weekday: 'short' });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
      {/* Top Bar Navigation */}
      <div className="w-full max-w-md px-2">
        <div className="relative flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-2 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <button 
            onClick={() => navigateMonth(-1)} 
            className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div 
            className="flex-1 flex flex-col items-center cursor-pointer" 
            onClick={() => setShowQuickJump(!showQuickJump)}
          >
            <div className={`flex flex-col items-center transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-1">
                  {monthName} <span className="text-indigo-600 dark:text-indigo-500">{yearName}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${showQuickJump ? 'rotate-180' : ''}`} />
                </h2>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigateMonth(1)} 
            className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Day Scroller */}
      <div className="w-full relative px-2">
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-4 px-4 no-scrollbar snap-x scroll-smooth"
        >
          {/* "All" Option */}
          <button
            onClick={() => onDayChange(null)}
            className={`flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all snap-center ${
              selectedDay === null 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200'
            }`}
          >
            <CalendarDays className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-black uppercase">All</span>
          </button>

          {daysArray.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = isCurrentMonth && currentDay === day;
            
            return (
              <button
                key={day}
                data-day={day}
                onClick={() => onDayChange(day)}
                className={`flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all snap-center relative ${
                  isSelected 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200'
                }`}
              >
                <span className={`text-[10px] font-black uppercase mb-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {getDayName(day)}
                </span>
                <span className={`text-xl font-black ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                  {day}
                </span>
                {isToday && (
                  <div className={`absolute bottom-2 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Fading Edges */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-slate-50 dark:from-[#0f172a] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-slate-50 dark:from-[#0f172a] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
