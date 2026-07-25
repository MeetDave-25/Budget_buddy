import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CategoryIcon } from './CategoryIcon';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, AlertCircle, Trophy, Flame, Award, Star, LogOut, Check } from 'lucide-react';
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
    updated[index] = { ...updated[index], limit: newLimit === '' ? '' : Number(newLimit) || 0 };
    setCategories(updated);
  };

  const handleSaveBudget = () => {
    onUpdateBudget(Number(totalBudget), userData.categories);
    setShowBudgetSuccess(true);
    toast.success('Total budget updated successfully');
    setTimeout(() => setShowBudgetSuccess(false), 3000);
  };

  const handleSaveCategories = () => {
    onUpdateBudget(userData.totalBudget, categories);
    setShowCategorySuccess(true);
    toast.success('Category limits updated successfully');
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
      toast.success('Monthly income updated!');
      setTimeout(() => setShowIncomeSuccess(false), 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update income');
    }
  };

  const totalCategoryLimits = categories.reduce((sum: number, cat: any) => sum + Number(cat.limit || 0), 0);
  const isOverBudget = totalCategoryLimits > Number(totalBudget);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your budget limits and account</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Income & Total Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 glass-card h-full">
                <h3 className="text-lg font-semibold mb-4">Monthly Income</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Monthly Income (₹)</label>
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="h-12 text-lg font-semibold bg-white/5 border-white/10"
                    />
                  </div>
                  <Button
                    onClick={handleSaveIncome}
                    className="w-full h-11"
                    variant={showIncomeSuccess ? "outline" : "default"}
                  >
                    {showIncomeSuccess ? <><Check className="w-4 h-4 mr-2 text-emerald-400" /> Saved</> : 'Save Income'}
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 glass-card h-full">
                <h3 className="text-lg font-semibold mb-4">Monthly Budget</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Total Budget (₹)</label>
                    <Input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="h-12 text-lg font-semibold bg-white/5 border-white/10"
                    />
                  </div>
                  <Button
                    onClick={handleSaveBudget}
                    className="w-full h-11"
                    variant={showBudgetSuccess ? "outline" : "default"}
                  >
                    {showBudgetSuccess ? <><Check className="w-4 h-4 mr-2 text-emerald-400" /> Saved</> : 'Save Budget'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Category Limits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 glass-card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-semibold">Category Limits</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex flex-col text-right">
                    <span className="text-muted-foreground">Total Limits</span>
                    <span className={`font-bold ${isOverBudget ? 'text-destructive' : 'text-emerald-400'}`}>
                      ₹{totalCategoryLimits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-bold text-white">₹{Number(totalBudget).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {isOverBudget && (
                <Alert className="mb-6 bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Your category limits exceed your total monthly budget.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white/10`}>
                            <CategoryIcon category={cat.name} className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-white">{cat.name}</span>
                        </div>
                        {cat.spent > (cat.limit || 0) && (
                          <Badge variant="destructive" className="text-[10px]">Over Budget</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          value={cat.limit === '' ? '' : cat.limit}
                          onChange={(e) => handleCategoryLimitChange(i, e.target.value)}
                          placeholder="Set limit"
                          className="bg-transparent border-b border-white/20 rounded-none px-0 h-8 focus-visible:ring-0 focus-visible:border-primary text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <Button
                    onClick={handleSaveCategories}
                    className="w-full sm:w-auto h-11"
                    variant={showCategorySuccess ? "outline" : "default"}
                  >
                    {showCategorySuccess ? <><Check className="w-4 h-4 mr-2 text-emerald-400" /> Limits Saved</> : 'Save Limits'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Gamification & Account */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 glass-card border-amber-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />
              
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-amber-100">
                <Trophy className="w-5 h-5 text-amber-400" />
                Achievements
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="p-3 rounded-full bg-amber-500/20">
                    <Flame className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-200/70 mb-0.5">Saving Streak</p>
                    <p className="text-2xl font-bold text-amber-400">
                      {userData.currentStreak || 0} Days {userData.currentStreak > 0 && '🔥'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-white/70 mb-3">Badges Earned</p>
                  <div className="grid grid-cols-3 gap-2">
                    {userData.badges && userData.badges.length > 0 ? (
                      <>
                        {userData.badges.map((badge: string, i: number) => (
                          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center gap-1 aspect-square">
                            <Award className="w-5 h-5 text-amber-400" />
                            <p className="text-[10px] font-medium leading-tight text-white/90">{badge}</p>
                          </div>
                        ))}
                        {[...Array(Math.max(0, 6 - userData.badges.length))].map((_, i) => (
                          <div key={`locked-${i}`} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center gap-1 aspect-square opacity-40">
                            <Star className="w-5 h-5 text-white/40" />
                            <p className="text-[10px] leading-tight">Locked</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="col-span-3 text-center py-6 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-sm text-white/60">
                          Start tracking expenses to earn badges!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 glass-card border-destructive/20">
              <h3 className="text-lg font-semibold mb-4 text-white">Account</h3>
              <Button
                variant="destructive"
                className="w-full bg-destructive/20 hover:bg-destructive/40 text-destructive-foreground border border-destructive/30"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              
              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  Made with ♥ By <span className="font-semibold text-white/70">Meet G. Dave</span>
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Version 2.0.0 (Premium)</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
