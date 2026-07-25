import React, { Suspense } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CategoryIcon } from './CategoryIcon';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Wallet, PiggyBank, Plus, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

// Lazy load 3D to maintain performance
const ThreeDWallet = React.lazy(() => import('./3d/ThreeDWallet'));

interface DashboardProps {
  userData: any;
  onAddExpense: () => void;
}

export function Dashboard({ userData, onAddExpense }: DashboardProps) {
  const { totalBudget, spent, categories, expenses, alerts, aiSuggestions, badges, full_name } = userData;
  const remaining = totalBudget - spent;
  const percentageSpent = (spent / totalBudget) * 100;
  const userName = full_name || 'there';

  return (
    <div className="space-y-6">
      {/* Welcome & 3D Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        <div className="lg:col-span-2 relative z-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Good evening, <span className="text-primary">{userName}</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">Here is your financial overview for the month.</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((badge: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
                >
                  <Badge className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 text-xs">
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <div className="hidden lg:block lg:col-span-1 h-64 relative">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <ThreeDWallet />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {alerts.map((alert: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Alert className="border-destructive/50 bg-destructive/10 text-destructive backdrop-blur-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                {alert.message}
              </AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Balance Card (Spans 2 columns) */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 glass-card relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Monthly Budget</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Remaining</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-bold tracking-tighter text-white">₹{remaining.toLocaleString()}</h2>
                  <span className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    Good
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-white">Spent: ₹{spent.toLocaleString()}</span>
                  <span className="text-muted-foreground">{percentageSpent.toFixed(0)}%</span>
                </div>
                <Progress value={percentageSpent} className="h-2 bg-white/10" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 glass-card border-purple-500/30 relative h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-purple-100">Smart Insights</h3>
            </div>
            <div className="space-y-4">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.slice(0, 2).map((suggestion: string, i: number) => (
                  <p key={i} className="text-sm text-purple-200 leading-relaxed">
                    {suggestion}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No insights yet. Add more expenses!</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Savings Goal Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 glass-card border-emerald-500/30 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-emerald-100">Savings Goal</h3>
              </div>
              <p className="text-3xl font-bold text-white mb-1">₹{userData.savingsGoal?.toLocaleString() || 0}</p>
              <p className="text-sm text-muted-foreground">Target for this month</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 glass-card h-full">
            <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Spending by Category
            </h3>
            <div className="space-y-5">
              {categories.map((cat: any, i: number) => {
                const percentage = (cat.spent / cat.limit) * 100;
                const isOverBudget = cat.spent > cat.limit;
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/10 group-hover:bg-primary/20 transition-colors`}>
                          <CategoryIcon category={cat.name} className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          ₹{cat.spent.toLocaleString()} <span className="text-muted-foreground text-xs font-normal">/ ₹{cat.limit.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-1.5 bg-white/5 ${isOverBudget ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 glass-card h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <button onClick={() => {}} className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                View All
              </button>
            </div>
            
            <div className="flex-1 space-y-4">
              {expenses.length > 0 ? (
                expenses.slice(0, 5).map((expense: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl bg-white/10`}>
                        <CategoryIcon category={expense.category} className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{expense.notes || expense.category}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">-₹{expense.amount.toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <Receipt className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">No transactions yet</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Floating Action Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddExpense}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center z-40 border border-white/20"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
