import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CategoryIcon } from './CategoryIcon';
import { motion } from 'motion/react';
import { TrendingUp, AlertCircle, Wallet, PiggyBank, Plus } from 'lucide-react';


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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 pb-24">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl mb-1">Hey {userName}! 👋</h1>
              <p className="text-muted-foreground text-sm">Here's your budget overview</p>
            </div>
            <div className="flex gap-2">
              {badges.slice(0, 2).map((badge: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {alerts.map((alert: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                {alert.message}
              </AlertDescription>
            </Alert>
          </motion.div>
        ))}

        {/* Budget Overview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5" />
              <span className="text-sm opacity-90">Monthly Budget</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs opacity-80 mb-1">Budget</p>
                  <p className="text-xl">₹{totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs opacity-80 mb-1">Spent</p>
                  <p className="text-xl">₹{spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs opacity-80 mb-1">Left</p>
                  <p className="text-xl text-green-300">₹{remaining.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{percentageSpent.toFixed(0)}% used</span>
                  <span>{(100 - percentageSpent).toFixed(0)}% remaining</span>
                </div>
                <Progress value={percentageSpent} className="h-3 bg-white/20" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-blue-600" />
              Category Spending
            </h3>
            <div className="space-y-4">
              {categories.map((cat: any, i: number) => {
                const percentage = (cat.spent / cat.limit) * 100;
                const isOverBudget = cat.spent > cat.limit;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${cat.color}`}>
                          <CategoryIcon category={cat.name} className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          ₹{cat.spent} / ₹{cat.limit}
                        </p>
                        {isOverBudget && (
                          <p className="text-xs text-red-600">+₹{cat.spent - cat.limit} over</p>
                        )}
                      </div>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-green-800">AI Insights</h3>
            </div>
            <div className="space-y-2">
              {aiSuggestions.slice(0, 2).map((suggestion: string, i: number) => (
                <p key={i} className="text-sm text-green-700">
                  💡 {suggestion}
                </p>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="mb-4">Recent Expenses</h3>
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${expense.categoryColor}`}>
                      <CategoryIcon category={expense.category} className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm">{expense.notes || expense.category}</p>
                      <p className="text-xs text-muted-foreground">{expense.date}</p>
                    </div>
                  </div>
                  <p className="text-sm">₹{expense.amount}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddExpense}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl flex items-center justify-center z-40"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
