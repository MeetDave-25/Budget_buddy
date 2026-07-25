import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutDashboard, PieChart, Sparkles, Settings, Receipt, Search } from 'lucide-react';

interface CommandPaletteProps {
  onNavigate: (screen: string) => void;
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          label="Global Command Menu"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-xl mx-4 overflow-hidden rounded-xl border border-white/10 bg-background/80 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center border-b border-white/10 px-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Command.Input 
                autoFocus 
                placeholder="Type a command or search..." 
                className="w-full bg-transparent p-4 text-base outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading="Quick Actions" className="px-2 text-xs font-medium text-muted-foreground">
                <Command.Item 
                  onSelect={() => runCommand(() => onNavigate('expenses'))}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-sm text-foreground aria-selected:bg-primary/20 aria-selected:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Transaction</span>
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => onNavigate('ai'))}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-sm text-foreground aria-selected:bg-purple-500/20 aria-selected:text-purple-400 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI for Insights</span>
                </Command.Item>
              </Command.Group>

              <Command.Separator className="h-px bg-white/10 my-2" />

              <Command.Group heading="Navigation" className="px-2 text-xs font-medium text-muted-foreground">
                <Command.Item onSelect={() => runCommand(() => onNavigate('dashboard'))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-sm text-foreground aria-selected:bg-white/10 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Command.Item>
                <Command.Item onSelect={() => runCommand(() => onNavigate('expenses'))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-sm text-foreground aria-selected:bg-white/10 transition-colors">
                  <Receipt className="w-4 h-4" />
                  <span>Transactions</span>
                </Command.Item>
                <Command.Item onSelect={() => runCommand(() => onNavigate('reports'))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-sm text-foreground aria-selected:bg-white/10 transition-colors">
                  <PieChart className="w-4 h-4" />
                  <span>Analytics</span>
                </Command.Item>
                <Command.Item onSelect={() => runCommand(() => onNavigate('settings'))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-sm text-foreground aria-selected:bg-white/10 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
