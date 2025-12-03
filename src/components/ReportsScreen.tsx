import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, TrendingUp, Target } from 'lucide-react';

interface ReportsScreenProps {
  userData: any;
}

export function ReportsScreen({ userData }: ReportsScreenProps) {
  const { categories, totalBudget, spent, savingsGoal = 5000, currentSavings = 0 } = userData;

  const pieData = categories
    .filter((cat: any) => cat.spent > 0)
    .map((cat: any) => ({
      name: cat.name,
      value: cat.spent,
      color: getCategoryColor(cat.color),
    }));

  // Only show current month data for new users
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const monthlyData = [
    { month: currentMonth, spent: spent, budget: totalBudget },
  ];

  const savingsProgress = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0;
  const hasExpenses = spent > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 pb-24">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <h1 className="text-2xl mb-1">Reports & Analytics 📊</h1>
          <p className="text-muted-foreground text-sm">Visualize your spending patterns</p>
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button variant="outline" className="w-full" disabled={!hasExpenses}>
            <Download className="w-4 h-4 mr-2" />
            Export Report (PDF/Excel)
          </Button>
        </motion.div>

        {/* Pie Chart - Category Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="mb-4">Spending by Category</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {pieData.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{item.name}: ₹{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">No expenses yet</p>
                  <p className="text-sm">Start adding expenses to see your spending distribution</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Bar Chart - Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="mb-4">This Month's Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value}`} />
                <Legend />
                <Bar dataKey="spent" fill="#8b5cf6" name="Spent" radius={[8, 8, 0, 0]} />
                <Bar dataKey="budget" fill="#3b82f6" name="Budget" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-around">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="text-lg">₹{totalBudget}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Spent</p>
                <p className="text-lg">₹{spent}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                <p className="text-lg text-green-600">₹{totalBudget - spent}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Savings Tracker */}
        {savingsGoal > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-green-800">Savings Goal Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl text-green-700">₹{currentSavings}</p>
                    <p className="text-sm text-green-600">of ₹{savingsGoal} goal</p>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {savingsProgress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={savingsProgress} className="h-3 [&>div]:bg-green-600" />
                <p className="text-sm text-green-700">
                  💰 {currentSavings >= savingsGoal ? 'Goal achieved! 🎉' : `Keep going! Just ₹${savingsGoal - currentSavings} more to reach your goal!`}
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Insights - Only show if user has expenses */}
        {hasExpenses && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3>Key Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-700">
                    🎯 You can save ₹{(totalBudget - spent).toLocaleString()} this month
                  </p>
                </div>
                {spent < totalBudget * 0.5 && (
                  <div className="p-3 rounded-lg bg-green-50">
                    <p className="text-sm text-green-700">
                      ✨ Great job! You're staying well within your budget
                    </p>
                  </div>
                )}
                {spent > totalBudget * 0.9 && (
                  <div className="p-3 rounded-lg bg-orange-50">
                    <p className="text-sm text-orange-700">
                      ⚠️ You've used {((spent / totalBudget) * 100).toFixed(0)}% of your budget
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function getCategoryColor(className: string): string {
  const colorMap: Record<string, string> = {
    'bg-orange-100': '#fb923c',
    'bg-blue-100': '#60a5fa',
    'bg-green-100': '#4ade80',
    'bg-purple-100': '#c084fc',
    'bg-pink-100': '#f472b6',
    'bg-yellow-100': '#facc15',
    'bg-red-100': '#f87171',
    'bg-cyan-100': '#22d3ee',
  };
  return colorMap[className] || '#94a3b8';
}
