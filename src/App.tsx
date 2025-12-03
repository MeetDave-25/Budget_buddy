import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './components/Dashboard';
import { ExpenseScreen } from './components/ExpenseScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { AIScreen } from './components/AIScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { AlertCircle } from 'lucide-react';
import { calculateBadges, calculateStreak } from './lib/badgeUtils';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserData(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      if (profile) {
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId);

        if (categoriesError) throw categoriesError;

        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (expensesError) throw expensesError;

        const totalSpent = expenses?.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;

        const categoriesWithSpent = categories?.map((cat: any) => {
          const catSpent = expenses
            ?.filter((exp: any) => exp.category === cat.name)
            .reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;
          return { ...cat, spent: catSpent };
        }) || [];

        // Calculate streaks
        const streakData = calculateStreak(expenses || []);

        // Calculate badges
        const earnedBadges = calculateBadges({
          totalExpenses: expenses?.length || 0,
          spent: totalSpent,
          totalBudget: profile.total_budget,
          currentStreak: streakData.currentStreak,
        });

        // Update profile with new streak and badge data
        await supabase
          .from('profiles')
          .update({
            badges: earnedBadges,
            current_streak: streakData.currentStreak,
            longest_streak: streakData.longestStreak,
            last_expense_date: streakData.lastExpenseDate,
          })
          .eq('id', userId);

        setUserData({
          ...profile,
          monthlyIncome: profile.monthly_income,
          totalBudget: profile.total_budget,
          savingsGoal: profile.savings_goal,
          currentSavings: profile.current_savings,
          categories: categoriesWithSpent,
          expenses: expenses || [],
          spent: totalSpent,
          alerts: [],
          aiSuggestions: [],
          badges: earnedBadges,
          currentStreak: streakData.currentStreak,
          longestStreak: streakData.longestStreak,
        });
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
      setIsLoggedIn(true);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Auth state change listener will handle this
  };

  const handleOnboardingComplete = async (monthlyIncome: number, totalBudget: number) => {
    console.log('Starting onboarding with:', { monthlyIncome, totalBudget });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Got user:', user?.id);
      if (!user) throw new Error('No user found');

      console.log('Upserting profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          monthly_income: monthlyIncome,
          total_budget: totalBudget,
          savings_goal: 5000,
          current_savings: 0,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        throw profileError;
      }
      console.log('Profile upserted successfully');

      // Delete any existing categories for this user first (in case of retry)
      await supabase
        .from('categories')
        .delete()
        .eq('user_id', user.id);

      const defaultCategories = [
        { name: 'Food', limit: 3000, spent: 0, color: 'bg-orange-100', user_id: user.id },
        { name: 'Rent', limit: 4000, spent: 0, color: 'bg-blue-100', user_id: user.id },
        { name: 'Travel', limit: 2000, spent: 0, color: 'bg-green-100', user_id: user.id },
        { name: 'Entertainment', limit: 2000, spent: 0, color: 'bg-purple-100', user_id: user.id },
        { name: 'Shopping', limit: 1500, spent: 0, color: 'bg-pink-100', user_id: user.id },
        { name: 'Education', limit: 1000, spent: 0, color: 'bg-yellow-100', user_id: user.id },
      ];

      console.log('Inserting categories...');
      const { error: categoriesError } = await supabase
        .from('categories')
        .insert(defaultCategories);

      if (categoriesError) {
        console.error('Categories insert error:', categoriesError);
        throw categoriesError;
      }
      console.log('Categories inserted successfully');

      console.log('Fetching user data...');
      await fetchUserData(user.id);
      toast.success('Welcome to BudgetBuddy! 🎉');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUserData(null);
      setIsOnboarded(false);
      setCurrentScreen('dashboard');

      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  const handleAddExpense = async (expense: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: expense.amount,
          category: expense.category,
          category_color: expense.categoryColor,
          date: expense.date,
          notes: expense.notes
        });

      if (error) throw error;

      await fetchUserData(user.id);
      toast.success(`Added ₹${expense.amount} expense to ${expense.category}`);
      setCurrentScreen('dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateExpense = async (expenseId: string, updatedExpense: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('expenses')
        .update({
          amount: updatedExpense.amount,
          category: updatedExpense.category,
          category_color: updatedExpense.categoryColor,
          date: updatedExpense.date,
          notes: updatedExpense.notes
        })
        .eq('id', expenseId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchUserData(user.id);
      toast.success('Expense updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update expense');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchUserData(user.id);
      toast.success('Expense deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete expense');
    }
  };

  const handleUpdateBudget = async (totalBudget: number, categories: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ total_budget: totalBudget })
        .eq('id', user.id);

      if (profileError) throw profileError;

      for (const cat of categories) {
        if (cat.id) {
          await supabase
            .from('categories')
            .update({ limit: cat.limit })
            .eq('id', cat.id);
        }
      }

      await fetchUserData(user.id);
      toast.success('Budget updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Configuration Missing</h2>
          <p className="text-muted-foreground mb-4">
            It looks like the Supabase configuration is missing or incorrect.
          </p>
          <div className="bg-gray-100 p-3 rounded text-left text-sm font-mono overflow-x-auto">
            <p>Please check your <strong>.env</strong> file:</p>
            <p className="text-gray-500 mt-1">VITE_SUPABASE_URL=...</p>
            <p className="text-gray-500">VITE_SUPABASE_ANON_KEY=...</p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Note: You may need to restart the dev server after creating the .env file.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen">
      {currentScreen === 'dashboard' && (
        <Dashboard
          userData={userData}
          onAddExpense={() => setCurrentScreen('expenses')}
        />
      )}
      {currentScreen === 'expenses' && (
        <ExpenseScreen
          userData={userData}
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}
      {currentScreen === 'reports' && (
        <ReportsScreen userData={userData} />
      )}
      {currentScreen === 'ai' && (
        <AIScreen userData={userData} />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen
          userData={userData}
          onUpdateBudget={handleUpdateBudget}
          onLogout={handleLogout}
        />
      )}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
      <Toaster />
    </div>
  );
}
