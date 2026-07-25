import { LayoutDashboard, Receipt, PieChart, Sparkles, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'expenses', label: 'Transact', icon: Receipt },
    { id: 'reports', label: 'Analytics', icon: PieChart },
    { id: 'ai', label: 'Insights', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 md:hidden z-50">
      <div className="glass rounded-2xl p-2 mx-auto max-w-md flex justify-between items-center shadow-2xl border-white/10 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-16 ${
                isActive ? 'text-white' : 'text-muted-foreground hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
