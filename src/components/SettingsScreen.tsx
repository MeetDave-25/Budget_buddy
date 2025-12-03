import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CategoryIcon } from './CategoryIcon';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Settings, AlertCircle, Trophy, Flame, Award, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';


interface SettingsScreenProps {
  userData: any;
  onUpdateBudget: (totalBudget: number, categories: any[]) => void;
  onLogout: () => void;
}

export function SettingsScreen({ userData, onUpdateBudget, onLogout }: SettingsScreenProps) {
  const [totalBudget, setTotalBudget] = useState(userData.totalBudget.toString());
  const [monthlyIncome, setMonthlyIncome] = useState(userData.monthlyIncome?.toString() || '0');
  const [categories, setCategories] = useState(userData.categories);
  const [showBudgetSuccess, setShowBudgetSuccess] = useState(false);
  const [showCategorySuccess, setShowCategorySuccess] = useState(false);
  const [showIncomeSuccess, setShowIncomeSuccess] = useState(false);

  const handleCategoryLimitChange = (index: number, newLimit: string) => {
    const updated = [...categories];
    // Allow empty string, otherwise convert to number
    updated[index] = { ...updated[index], limit: newLimit === '' ? '' : Number(newLimit) || 0 };
    setCategories(updated);
  };

  const handleSaveBudget = () => {
    onUpdateBudget(Number(totalBudget), userData.categories);
    setShowBudgetSuccess(true);
    setTimeout(() => setShowBudgetSuccess(false), 3000);
  };

  const handleSaveCategories = () => {
    onUpdateBudget(userData.totalBudget, categories);
    setShowCategorySuccess(true);
    setTimeout(() => setShowCategorySuccess(false), 3000);
  };

  const handleSaveIncome = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ monthly_income: Number(monthlyIncome) })
        .eq('id', user.id);

      if (error) throw error;

      setShowIncomeSuccess(true);
      setTimeout(() => setShowIncomeSuccess(false), 3000);
      toast.success('Monthly income updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update income');
    }
  };

  const totalCategoryLimits = categories.reduce((sum: number, cat: any) => sum + cat.limit, 0);
  const isOverBudget = totalCategoryLimits > Number(totalBudget);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 pb-24">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <h1 className="text-2xl mb-1">Budget Settings ⚙️</h1>
          <p className="text-muted-foreground text-sm">Manage your budget and limits</p>
        </motion.div>



        {/* Total Budget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Monthly Budget
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-2 text-sm">Total Budget (₹)</label>
                <Input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="text-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveBudget}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Save Budget
                </Button>
                {showBudgetSuccess && (
                  <span className="text-sm text-green-600 flex items-center gap-1">✅ Saved!</span>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Category Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="mb-4">Category-wise Limits</h3>
            <div className="space-y-4">
              {categories.map((cat: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${cat.color}`}>
                      <CategoryIcon category={cat.name} className="w-4 h-4" />
                    </div>
                    <label className="flex-1 text-sm">{cat.name}</label>
                  </div>
                  <Input
                    type="number"
                    value={cat.limit === '' ? '' : cat.limit}
                    onChange={(e) => handleCategoryLimitChange(i, e.target.value)}
                    placeholder="Set limit"
                  />
                  {cat.spent > cat.limit && (
                    <p className="text-xs text-red-600">
                      ⚠️ Currently over budget by ₹{cat.spent - cat.limit}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted">
              <div className="flex justify-between text-sm mb-2">
                <span>Total Category Limits:</span>
                <span className={isOverBudget ? 'text-red-600' : ''}>
                  ₹{totalCategoryLimits.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly Budget:</span>
                <span>₹{Number(totalBudget).toLocaleString()}</span>
              </div>
              {isOverBudget && (
                <Alert className="mt-3 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">
                    Category limits exceed total budget by ₹{totalCategoryLimits - Number(totalBudget)}!
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleSaveCategories}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Save Category Limits
              </Button>
              {showCategorySuccess && (
                <span className="text-sm text-green-600 flex items-center gap-1">✅ Saved!</span>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Gamification - Badges & Streaks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <h3 className="mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Your Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-orange-100">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm mb-1">Saving Streak</p>
                  <p className="text-2xl text-orange-700">
                    {userData.currentStreak || 0} days {userData.currentStreak > 0 && '🔥'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {userData.badges && userData.badges.length > 0 ? (
                  <>
                    {userData.badges.map((badge: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="p-3 rounded-lg bg-white text-center shadow-sm"
                      >
                        <Award className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                        <p className="text-xs font-medium">{badge}</p>
                      </motion.div>
                    ))}
                    {/* Show locked slots for remaining badges */}
                    {[...Array(Math.max(0, 6 - userData.badges.length))].map((_, i) => (
                      <div key={`locked-${i}`} className="p-3 rounded-lg bg-white text-center opacity-50">
                        <Star className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                        <p className="text-xs">Locked</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="col-span-3 text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      🎯 Start tracking expenses to earn badges!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="mb-4">Monthly Income</h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-2 text-sm text-muted-foreground">
                  Update your monthly income (₹)
                </label>
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="text-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveIncome}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Save Income
                </Button>
                {showIncomeSuccess && (
                  <span className="text-sm text-green-600 flex items-center gap-1">✅ Saved!</span>
                )}
              </div>
            </div>
          </Card>
        </motion.div>



        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            variant="destructive"
            className="w-full"
            onClick={onLogout}
          >
            Logout
          </Button>
        </motion.div>

        {/* Credit Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center py-4"
        >
          <p className="text-sm text-muted-foreground">
            Made By <span className="font-semibold text-foreground">Meet G. Dave</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
