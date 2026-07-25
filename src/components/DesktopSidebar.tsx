import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, PieChart, Sparkles, Settings, LogOut, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface DesktopSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userData: any;
}

export function DesktopSidebar({ currentScreen, onNavigate, userData }: DesktopSidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Transactions', icon: Receipt },
    { id: 'reports', label: 'Analytics', icon: PieChart },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-white/10 glass">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_15px_rgba(14,165,233,0.5)]">
          B
        </div>
        <span className="font-bold text-xl tracking-tight">BudgetBuddy</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group ${
                isActive ? 'text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {userData && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-sm font-bold">
                {userData.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{userData.email}</span>
              <span className="text-xs text-emerald-400 font-medium">{userData.current_streak || 0} Day Streak 🔥</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
