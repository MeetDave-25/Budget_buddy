import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Lightbulb, TrendingDown, AlertTriangle, CheckCircle, Sparkles, Target, Zap } from 'lucide-react';

interface AIScreenProps {
  userData: any;
}

export function AIScreen({ userData }: AIScreenProps) {
  const { aiSuggestions, spent } = userData;

  const hasExpenses = spent > 0;
  const hasAISuggestions = aiSuggestions && aiSuggestions.length > 0;

  // Only show predictions if user has expense history
  const predictions = hasExpenses ? [
    { category: 'Food', predicted: 2800, current: 2400, trend: 'up' },
    { category: 'Travel', predicted: 1200, current: 1500, trend: 'down' },
    { category: 'Entertainment', predicted: 1600, current: 1800, trend: 'down' },
  ] : [];

  const tips = [
    {
      title: 'Pack Your Lunch',
      description: 'Save ₹500/month by bringing lunch from home 3 times a week',
      savings: 500,
      difficulty: 'Easy',
      icon: CheckCircle,
    },
    {
      title: 'Student Discounts',
      description: 'Use your student ID for 10-30% off on entertainment and food',
      savings: 300,
      difficulty: 'Easy',
      icon: Target,
    },
    {
      title: 'Bike More, Ride Less',
      description: 'Switch to cycling for short distances to cut travel costs',
      savings: 400,
      difficulty: 'Medium',
      icon: Zap,
    },
    {
      title: 'Share Subscriptions',
      description: 'Split streaming services with roommates to save money',
      savings: 250,
      difficulty: 'Easy',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 pb-24">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <h1 className="text-2xl mb-1">AI Money Coach 🤖</h1>
          <p className="text-muted-foreground text-sm">Smart suggestions to save more</p>
        </motion.div>

        {/* Main AI Insights */}
        {hasAISuggestions ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3>This Month's Analysis</h3>
              </div>
              <div className="space-y-3">
                {aiSuggestions.slice(0, 3).map((suggestion: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/10"
                  >
                    <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3>Getting Started</h3>
              </div>
              <div className="p-3 rounded-lg bg-white/10">
                <p className="text-sm">
                  💡 Start adding expenses to get personalized AI insights and spending analysis!
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Predictions - Only show if user has expenses */}
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-purple-600" />
                <h3>Next Month Predictions</h3>
              </div>
              <div className="space-y-3">
                {predictions.map((pred, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <div>
                      <p className="text-sm mb-1">{pred.category}</p>
                      <p className="text-xs text-muted-foreground">
                        Current: ₹{pred.current}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">₹{pred.predicted}</p>
                      <Badge
                        variant={pred.trend === 'up' ? 'destructive' : 'default'}
                        className="mt-1"
                      >
                        {pred.trend === 'up' ? '↑' : '↓'} {Math.abs(pred.predicted - pred.current)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Personalized Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Personalized Saving Tips
          </h3>
          <div className="space-y-3">
            {tips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-green-100 h-fit">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium">{tip.title}</h4>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Save ₹{tip.savings}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {tip.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-orange-800">Potential Savings</h3>
            </div>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-orange-700 mb-2">₹1,450</p>
              <p className="text-sm text-orange-600">per month with these tips!</p>
              <p className="text-xs text-orange-500 mt-2">
                That's ₹17,400 saved in a year! 🎉
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
