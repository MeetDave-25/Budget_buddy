import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, TrendingUp, Target, ChartArea } from 'lucide-react';

interface ReportsScreenProps {
  userData: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10 rounded-lg shadow-2xl">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">₹{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsScreen({ userData }: ReportsScreenProps) {
  const { categories, totalBudget, spent, savingsGoal = 5000, currentSavings = 0 } = userData;

  const pieData = categories
    .filter((cat: any) => cat.spent > 0)
    .map((cat: any) => ({
      name: cat.name,
      value: cat.spent,
      color: getCategoryColor(cat.color),
    }));

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const monthlyData = [
    { month: currentMonth, spent: spent, budget: totalBudget },
  ];

  const savingsProgress = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0;
  const hasExpenses = spent > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <ChartArea className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          </div>
          <p className="text-muted-foreground">Visualize your spending patterns</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button variant="outline" className="w-full md:w-auto" disabled={!hasExpenses}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <Card className="p-6 glass-card h-full">
            <h3 className="mb-6 text-lg font-semibold">Spending by Category</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 10px ${entry.color}40)` }} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pieData.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                      <span className="text-xs font-medium text-muted-foreground truncate" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <ChartArea className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Start adding expenses to see distribution</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Bar Chart - Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <Card className="p-6 glass-card h-full">
            <h3 className="mb-6 text-lg font-semibold">This Month's Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }} />
                <Bar dataKey="spent" fill="#c084fc" name="Spent" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="budget" fill="#38bdf8" name="Budget" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Tracker */}
        {savingsGoal > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 glass-card border-emerald-500/30">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-100">Savings Goal</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">₹{currentSavings.toLocaleString()}</p>
                    <p className="text-sm text-emerald-200/60">of ₹{savingsGoal.toLocaleString()} goal</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-3 py-1">
                    {savingsProgress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={savingsProgress} className="h-2 [&>div]:bg-emerald-400 bg-white/10" />
                <p className="text-sm text-emerald-200">
                  {currentSavings >= savingsGoal ? 'Goal achieved! 🎉' : `Keep going! Just ₹${(savingsGoal - currentSavings).toLocaleString()} more to reach your goal.`}
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Insights */}
        {hasExpenses && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 glass-card">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white">Key Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white flex items-center gap-2">
                    <span className="text-xl">🎯</span> You can save <span className="font-bold text-emerald-400">₹{(totalBudget - spent).toLocaleString()}</span> this month
                  </p>
                </div>
                {spent < totalBudget * 0.5 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white flex items-center gap-2">
                      <span className="text-xl">✨</span> Great job! You're staying well within your budget
                    </p>
                  </div>
                )}
                {spent > totalBudget * 0.9 && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive-foreground flex items-center gap-2">
                      <span className="text-xl">⚠️</span> You've used <span className="font-bold">{((spent / totalBudget) * 100).toFixed(0)}%</span> of your budget
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
    'bg-blue-100': '#38bdf8',
    'bg-green-100': '#4ade80',
    'bg-purple-100': '#c084fc',
    'bg-pink-100': '#f472b6',
    'bg-yellow-100': '#facc15',
    'bg-red-100': '#f87171',
    'bg-cyan-100': '#22d3ee',
  };
  return colorMap[className] || '#94a3b8';
}
