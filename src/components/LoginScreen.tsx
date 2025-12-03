import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Wallet, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });

        if (error) throw error;

        // Check if email confirmation is required
        if (data?.user && !data.session) {
          toast.success('Signup successful! Please check your email to confirm your account.');
          setIsSignup(false); // Switch to login mode
        } else if (data?.session) {
          // Auto-login successful (email confirmation disabled)
          toast.success('Welcome to BudgetBuddy! 🎉');
          onLogin();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Login successful!');
        onLogin();
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
          >
            <Wallet className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BudgetBuddy
          </h1>
          <p className="text-muted-foreground">Track, Save, Succeed 🎓</p>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Email</label>
              <Input
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block mb-2 text-sm">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </motion.div>
            )}
            <Button
              onClick={handleAuth}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSignup ? 'Sign Up' : 'Login')}
            </Button>
            <div className="text-center text-sm">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600 hover:underline"
              >
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-muted-foreground">
            Smart budgeting for smarter students 💡
          </p>
          <p className="text-xs text-muted-foreground">
            Made By <span className="font-semibold text-foreground">Meet G. Dave</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
