import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useState } from 'react';
import { DollarSign, Target } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (monthlyIncome: number, totalBudget: number) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [totalBudget, setTotalBudget] = useState('');

  const handleNext = () => {
    if (step === 1 && monthlyIncome) {
      setStep(2);
    } else if (step === 2 && totalBudget) {
      onComplete(Number(monthlyIncome), Number(totalBudget));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-6">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
          </div>
          <h2 className="text-2xl mb-2">
            {step === 1 ? "Let's get started!" : 'Set your budget'}
          </h2>
          <p className="text-muted-foreground">
            {step === 1 ? 'First, tell us your monthly income' : 'How much do you want to budget?'}
          </p>
        </div>

        <Card className="p-6 shadow-lg">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <label className="block mb-2 text-sm">Monthly Income (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g., 15000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="text-center text-xl"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-purple-100 mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <label className="block mb-2 text-sm">Total Monthly Budget (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g., 12000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="text-center text-xl"
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Recommended: 80% of your income (₹{Math.round(Number(monthlyIncome) * 0.8)})
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step === 2 && (
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={step === 1 ? !monthlyIncome : !totalBudget}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {step === 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
