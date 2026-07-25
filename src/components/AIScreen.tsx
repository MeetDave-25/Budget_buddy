import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Bot, 
  TrendingUp, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Coins,
  ArrowRight
} from 'lucide-react';

interface AIScreenProps {
  userData: any;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: InsightCard[];
}

interface InsightCard {
  type: 'warning' | 'success' | 'tip' | 'prediction';
  title: string;
  value: string;
  description: string;
}

// Helper function to parse markdown-style text
const parseMarkdown = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    const parseBold = (str: string) => {
      const boldRegex = /\*\*(.+?)\*\*/g;
      const result: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          result.push(str.substring(lastIndex, match.index));
        }
        result.push(
          <strong key={match.index} className="font-bold text-white">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < str.length) {
        result.push(str.substring(lastIndex));
      }
      return result.length > 0 ? result : str;
    };

    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      const bulletContent = line.replace(/^[•\-]\s*/, '');
      return (
        <div key={lineIndex} className={`flex items-start gap-2 ${lineIndex > 0 ? 'mt-2' : ''}`}>
          <span className="text-primary font-bold">•</span>
          <span className="text-white/80">{parseBold(bulletContent)}</span>
        </div>
      );
    }
    
    const emojiRegex = /^([\p{Emoji}])/u;
    if (emojiRegex.test(line.trim()) && line.includes('**')) {
      return (
        <div key={lineIndex} className={`text-base font-semibold text-white mb-2 ${lineIndex > 0 ? 'mt-1' : ''}`}>
          {parseBold(line)}
        </div>
      );
    }
    
    if (line.trim()) {
      return (
        <div key={lineIndex} className={`text-white/80 ${lineIndex > 0 ? 'mt-1.5' : ''}`}>
          {parseBold(line)}
        </div>
      );
    }
    
    return <div key={lineIndex} className="h-2" />;
  });
};

export function AIScreen({ userData }: AIScreenProps) {
  const { totalBudget, spent, categories, expenses, full_name } = userData;
  const remaining = totalBudget - spent;
  const percentageSpent = (spent / totalBudget) * 100;
  const userName = full_name?.split(' ')[0] || 'there';

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { label: '📊 Summary', query: 'Show my spending summary' },
    { label: '💡 Tips', query: 'How can I save more money?' },
    { label: '⚠️ Alerts', query: 'Which categories are over budget?' },
    { label: '📈 Forecast', query: 'Predict my next month spending' },
    { label: '🎯 Goals', query: 'Help me set savings goals' },
    { label: '🔍 Analyze', query: 'Analyze my expenses' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        type: 'ai',
        content: `Hey ${userName}! 👋 I'm your Budget AI. I'm here to help you track spending, save money, and reach your financial goals. What would you like to know?`,
        timestamp: new Date(),
        suggestions: ['Show my spending summary', 'How can I save more?', 'Am I on track this month?'],
      };
      setMessages([greeting]);
    }
  }, []);

  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase().trim();
    let response: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: '',
      timestamp: new Date(),
    };

    if (lowerQuery.includes('summary') || lowerQuery.includes('spending')) {
      const topCategory = categories.reduce((a: any, b: any) => (a.spent > b.spent ? a : b), categories[0]);
      response.content = `📊 **Your Spending Summary**\n\nYou've spent **₹${spent.toLocaleString()}** out of your **₹${totalBudget.toLocaleString()}** budget this month.\n\n${percentageSpent > 80 ? '⚠️ Watch out!' : '✅ Great job!'} You've used ${percentageSpent.toFixed(0)}% of your budget.\n\nYour top spending category is **${topCategory?.name}** with ₹${topCategory?.spent.toLocaleString()} spent.`;
      response.insights = [
        {
          type: percentageSpent > 80 ? 'warning' : 'success',
          title: 'Budget Status',
          value: `${percentageSpent.toFixed(0)}%`,
          description: `₹${remaining.toLocaleString()} remaining`
        }
      ];
      response.suggestions = ['Which categories need attention?', 'Tips to reduce spending'];
    }
    else if (lowerQuery.includes('save') || lowerQuery.includes('tip')) {
      response.content = `💡 **Smart Saving Tips for You**\n\nBased on your spending patterns:\n\n• **Track daily expenses** - Small purchases add up!\n• **Use the 50/30/20 rule** - 50% needs, 30% wants, 20% savings\n• **Review subscriptions** - Cancel unused services`;
      response.insights = [
        {
          type: 'tip',
          title: 'Potential Savings',
          value: `₹${Math.floor(spent * 0.15).toLocaleString()}`,
          description: 'By reducing 15% in high-spend areas'
        }
      ];
      response.suggestions = ['Create a savings plan', 'Check my budget alerts'];
    }
    else {
      response.content = `🤔 **Let me help you with that!**\n\nI noticed you asked about "${query}". Here's a quick snapshot:\n\n📊 **Your Budget:** ₹${totalBudget.toLocaleString()}\n💰 **Spent:** ₹${spent.toLocaleString()} (${percentageSpent.toFixed(0)}%)\n✨ **Remaining:** ₹${remaining.toLocaleString()}`;
      response.suggestions = ['Show tips', 'Check progress', 'View alerts'];
    }

    return response;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: query,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse = generateAIResponse(query);
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }, 50);
    setInputValue('');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'tip': return Lightbulb;
      case 'prediction': return TrendingUp;
      default: return Coins;
    }
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'tip': return 'bg-primary/10 border-primary/20 text-primary';
      case 'prediction': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      default: return 'bg-white/5 border-white/10 text-white';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <Bot className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            Budget AI
            <Sparkles className="w-4 h-4 text-purple-400" />
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Online & Ready
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleQuickAction(action.query)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center text-center"
          >
            {action.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] ${message.type === 'user' ? 'glass-card bg-primary/20 border-primary/30' : 'glass-card'} p-4 rounded-2xl`}>
                <div className="text-sm leading-relaxed">
                  {message.type === 'ai' ? parseMarkdown(message.content) : <span className="text-white">{message.content}</span>}
                </div>
              </div>

              {/* Insights */}
              {message.insights && message.insights.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[85%] md:max-w-[75%]">
                  {message.insights.map((insight, i) => {
                    const Icon = getInsightIcon(insight.type);
                    const styleClass = getInsightStyle(insight.type);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className={`p-4 rounded-xl border ${styleClass}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">{insight.title}</span>
                        </div>
                        <p className="text-2xl font-bold mb-1 text-white">{insight.value}</p>
                        <p className="text-xs opacity-80">{insight.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 max-w-[85%] md:max-w-[75%]">
                  {message.suggestions.map((suggestion, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickAction(suggestion)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-primary hover:bg-primary/10 transition-colors flex items-center gap-1"
                    >
                      {suggestion}
                      <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-muted-foreground p-4"
          >
            <Bot className="w-5 h-5 text-purple-400" />
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-purple-400"
                  animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-2 rounded-2xl flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI anything about your budget..."
          className="flex-1 bg-transparent border-none text-white focus:ring-0 px-4 py-2 placeholder:text-muted-foreground"
        />
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          size="icon"
          className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
