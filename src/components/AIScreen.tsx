import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
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
  // Pattern to match **bold**, bullet points, and headings
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Parse bold text within each line
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
          <strong key={match.index} style={{ fontWeight: 600, color: '#1e1b4b' }}>
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

    // Check for bullet points
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      const bulletContent = line.replace(/^[•\-]\s*/, '');
      return (
        <div key={lineIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: lineIndex > 0 ? '8px' : '0' }}>
          <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>•</span>
          <span>{parseBold(bulletContent)}</span>
        </div>
      );
    }
    
    // Check for emoji heading (starts with emoji)
    const emojiRegex = /^([\p{Emoji}])/u;
    if (emojiRegex.test(line.trim()) && line.includes('**')) {
      return (
        <div key={lineIndex} style={{ 
          fontSize: '15px', 
          fontWeight: 600, 
          color: '#1e1b4b',
          marginBottom: '8px',
          marginTop: lineIndex > 0 ? '4px' : '0'
        }}>
          {parseBold(line)}
        </div>
      );
    }
    
    // Regular line
    if (line.trim()) {
      return (
        <div key={lineIndex} style={{ marginTop: lineIndex > 0 ? '6px' : '0' }}>
          {parseBold(line)}
        </div>
      );
    }
    
    // Empty line = spacing
    return <div key={lineIndex} style={{ height: '8px' }} />;
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
    { label: '📊 Spending Summary', query: 'Show my spending summary' },
    { label: '💡 Save Money Tips', query: 'How can I save more money?' },
    { label: '⚠️ Budget Alerts', query: 'Which categories are over budget?' },
    { label: '📈 Predictions', query: 'Predict my next month spending' },
    { label: '🎯 Set Goals', query: 'Help me set savings goals' },
    { label: '🔍 Analyze Expenses', query: 'Analyze my expenses' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        type: 'ai',
        content: `Hey ${userName}! 👋 I'm your AI Budget Coach. I'm here to help you track spending, save money, and reach your financial goals. What would you like to know?`,
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

    // Greeting responses
    const greetings = ['hi', 'hello', 'hey', 'hii', 'hiii', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'hola'];
    if (greetings.some(g => lowerQuery === g || lowerQuery.startsWith(g + ' ') || lowerQuery.startsWith(g + '!'))) {
      const greetingResponses = [
        `👋 **Hey there!**\n\nGreat to see you! I'm your Budget AI assistant. I can help you:\n\n• Track your spending habits\n• Find ways to save money\n• Predict your month-end balance\n• Set and achieve financial goals\n\nWhat would you like to know about your finances today?`,
        `🌟 **Hello!**\n\nWelcome back! Here's a quick snapshot:\n\n**Budget Used:** ${percentageSpent.toFixed(0)}%\n**Remaining:** ₹${remaining.toLocaleString()}\n\nHow can I assist you today? Ask me about tips, alerts, or your spending!`,
        `😊 **Hi there!**\n\nReady to master your money? You've spent ₹${spent.toLocaleString()} so far this month.\n\nTry asking me:\n• "How am I doing?"\n• "Give me saving tips"\n• "Show budget alerts"`
      ];
      response.content = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
      response.suggestions = ['Show my spending', 'Give me tips', 'Check budget alerts'];
      return response;
    }

    // Help / What can you do
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you') || lowerQuery.includes('what do you do') || lowerQuery === '?') {
      response.content = `🤖 **I'm Your Budget AI Assistant!**\n\nHere's everything I can help you with:\n\n📊 **Spending Analysis**\n• "Show my spending summary"\n• "Analyze my expenses"\n• "Where does my money go?"\n\n💡 **Money-Saving Tips**\n• "How can I save money?"\n• "Give me budget tips"\n• "Help me reduce spending"\n\n⚠️ **Budget Monitoring**\n• "Check my budget alerts"\n• "Am I over budget?"\n• "Which categories need attention?"\n\n📈 **Predictions & Goals**\n• "Predict my spending"\n• "Help me set goals"\n• "What's my forecast?"\n\nJust type your question naturally!`;
      response.suggestions = ['Show spending summary', 'Give saving tips', 'Check alerts'];
      return response;
    }

    // Thanks / Appreciation
    if (lowerQuery.includes('thank') || lowerQuery.includes('thanks') || lowerQuery.includes('thx') || lowerQuery.includes('awesome') || lowerQuery.includes('great')) {
      const thankResponses = [
        `😊 **You're welcome!**\n\nI'm always here to help you stay on top of your finances. Is there anything else you'd like to know?`,
        `🙌 **Happy to help!**\n\nRemember, small savings add up to big results! Let me know if you need more tips.`,
        `✨ **Glad I could assist!**\n\nKeep up the great work with your budgeting. I'm here whenever you need me!`
      ];
      response.content = thankResponses[Math.floor(Math.random() * thankResponses.length)];
      response.suggestions = ['Show more tips', 'Check my progress', 'Set a goal'];
      return response;
    }

    // Spending Summary
    if (lowerQuery.includes('summary') || lowerQuery.includes('spending') || lowerQuery.includes('overview') || lowerQuery.includes('where') && lowerQuery.includes('money')) {
      const topCategory = categories.reduce((a: any, b: any) => (a.spent > b.spent ? a : b), categories[0]);
      response.content = `📊 **Your Spending Summary**\n\nYou've spent **₹${spent.toLocaleString()}** out of your **₹${totalBudget.toLocaleString()}** budget this month.\n\n${percentageSpent > 80 ? '⚠️ Watch out!' : '✅ Great job!'} You've used ${percentageSpent.toFixed(0)}% of your budget.\n\nYour top spending category is **${topCategory?.name}** with ₹${topCategory?.spent.toLocaleString()} spent.`;
      response.insights = [
        {
          type: percentageSpent > 80 ? 'warning' : 'success',
          title: 'Budget Status',
          value: `${percentageSpent.toFixed(0)}%`,
          description: `₹${remaining.toLocaleString()} remaining`
        },
        {
          type: 'tip',
          title: 'Top Category',
          value: topCategory?.name || 'N/A',
          description: `₹${topCategory?.spent.toLocaleString()} spent`
        }
      ];
      response.suggestions = ['Which categories need attention?', 'Tips to reduce spending', 'Show detailed breakdown'];
    }
    // Save Money Tips
    else if (lowerQuery.includes('save') || lowerQuery.includes('tip') || lowerQuery.includes('reduce') || lowerQuery.includes('cut') || lowerQuery.includes('budget better') || lowerQuery.includes('advice') || lowerQuery.includes('suggest') || lowerQuery.includes('recommend') || lowerQuery.includes('how to') || lowerQuery.includes('help me')) {
      const overBudgetCats = categories.filter((c: any) => c.spent > c.limit);
      const potentialSavings = categories.reduce((acc: number, cat: any) => {
        if (cat.spent > cat.limit * 0.8) {
          return acc + Math.floor(cat.spent * 0.15);
        }
        return acc;
      }, 0);

      // Multiple tip variations
      const tipVariations = [
        {
          content: `💡 **Smart Saving Tips for You**\n\n${overBudgetCats.length > 0 ? `🚨 You have ${overBudgetCats.length} categor${overBudgetCats.length > 1 ? 'ies' : 'y'} over budget!\n\n` : ''}Based on your spending patterns:\n\n• **Track daily expenses** - Small purchases add up!\n• **Use the 50/30/20 rule** - 50% needs, 30% wants, 20% savings\n• **Review subscriptions** - Cancel unused services\n• **Cook at home more** - Save up to 40% on food costs\n• **Set weekly spending limits** - Break down monthly budgets`,
          suggestions: ['Show me my high-spend categories', 'Create a savings plan', 'Track my progress']
        },
        {
          content: `🎯 **Personalized Money Tips**\n\nHere's how you can optimize your ₹${totalBudget.toLocaleString()} budget:\n\n• **Automate savings** - Transfer 10% on payday before spending\n• **Wait 24 hours** - For any purchase over ₹500\n• **Use cash for discretionary spending** - Physically seeing money leave helps\n• **Meal prep on Sundays** - Save time and money\n• **Unsubscribe from marketing emails** - Reduce impulse buys`,
          suggestions: ['Check my budget alerts', 'Analyze my spending', 'Set a savings goal']
        },
        {
          content: `💰 **Quick Wins to Save More**\n\nYou're spending ₹${Math.round(spent / new Date().getDate()).toLocaleString()}/day. Here's how to optimize:\n\n• **No-spend days** - Try 2 per week, save ₹${Math.round((spent / new Date().getDate()) * 8).toLocaleString()}/month\n• **Compare before buying** - Use price comparison apps\n• **Student discounts** - Always ask! Many places offer 10-20% off\n• **Library over bookstores** - Free books and resources\n• **Free entertainment** - Parks, YouTube, free events`,
          suggestions: ['Show my daily average', 'Predict month end', 'View progress']
        }
      ];

      const selectedTip = tipVariations[Math.floor(Math.random() * tipVariations.length)];
      response.content = selectedTip.content;
      response.suggestions = selectedTip.suggestions;
      response.insights = [
        {
          type: 'tip',
          title: 'Potential Savings',
          value: `₹${potentialSavings.toLocaleString()}`,
          description: 'By reducing 15% in high-spend areas'
        },
        {
          type: 'success',
          title: 'Yearly Impact',
          value: `₹${(potentialSavings * 12).toLocaleString()}`,
          description: 'If you maintain these savings'
        }
      ];
    }
    // Budget Alerts / Over Budget
    else if (lowerQuery.includes('alert') || lowerQuery.includes('over budget') || lowerQuery.includes('warning') || lowerQuery.includes('attention') || lowerQuery.includes('problem') || lowerQuery.includes('issue') || lowerQuery.includes('trouble')) {
      const overBudgetCats = categories.filter((c: any) => c.spent > c.limit);
      const nearLimitCats = categories.filter((c: any) => c.spent > c.limit * 0.8 && c.spent <= c.limit);

      if (overBudgetCats.length === 0 && nearLimitCats.length === 0) {
        response.content = `✅ **Great News!**\n\nAll your categories are within budget! Keep up the excellent work!\n\n🎯 You're doing better than 78% of users with similar budgets.`;
        response.insights = [
          {
            type: 'success',
            title: 'Status',
            value: 'All Good!',
            description: 'No categories over budget'
          }
        ];
      } else {
        let alertText = `⚠️ **Budget Alerts**\n\n`;
        if (overBudgetCats.length > 0) {
          alertText += `**🔴 Over Budget (${overBudgetCats.length}):**\n`;
          overBudgetCats.forEach((cat: any) => {
            alertText += `• ${cat.name}: ₹${cat.spent} / ₹${cat.limit} (+₹${cat.spent - cat.limit})\n`;
          });
        }
        if (nearLimitCats.length > 0) {
          alertText += `\n**🟡 Near Limit (${nearLimitCats.length}):**\n`;
          nearLimitCats.forEach((cat: any) => {
            alertText += `• ${cat.name}: ${((cat.spent / cat.limit) * 100).toFixed(0)}% used\n`;
          });
        }
        response.content = alertText;
        response.insights = overBudgetCats.slice(0, 2).map((cat: any) => ({
          type: 'warning' as const,
          title: cat.name,
          value: `+₹${(cat.spent - cat.limit).toLocaleString()}`,
          description: 'Over budget'
        }));
      }
      response.suggestions = ['How to fix this?', 'Adjust my budget', 'Show saving tips'];
    }
    // Predictions
    else if (lowerQuery.includes('predict') || lowerQuery.includes('next month') || lowerQuery.includes('forecast')) {
      const daysInMonth = 30;
      const daysPassed = new Date().getDate();
      const dailyAverage = spent / daysPassed;
      const projectedSpend = Math.round(dailyAverage * daysInMonth);
      const projectedDiff = projectedSpend - totalBudget;

      response.content = `📈 **Spending Predictions**\n\nBased on your current spending pattern:\n\n**Daily Average:** ₹${Math.round(dailyAverage).toLocaleString()}\n**Projected Month End:** ₹${projectedSpend.toLocaleString()}\n\n${projectedDiff > 0 ? `⚠️ You might exceed budget by **₹${projectedDiff.toLocaleString()}**` : `✅ You're on track to stay **₹${Math.abs(projectedDiff).toLocaleString()}** under budget!`}`;
      response.insights = [
        {
          type: projectedDiff > 0 ? 'warning' : 'success',
          title: 'Month-End Forecast',
          value: `₹${projectedSpend.toLocaleString()}`,
          description: projectedDiff > 0 ? 'Over budget' : 'Within budget'
        },
        {
          type: 'prediction',
          title: 'Daily Average',
          value: `₹${Math.round(dailyAverage).toLocaleString()}`,
          description: `${daysPassed} days tracked`
        }
      ];
      response.suggestions = ['How to reduce projected spending?', 'Adjust my daily limit', 'Show weekly breakdown'];
    }
    // Goals
    else if (lowerQuery.includes('goal') || lowerQuery.includes('target') || lowerQuery.includes('savings goal')) {
      const suggestedSavings = Math.round(totalBudget * 0.2);
      response.content = `🎯 **Let's Set Your Goals**\n\nBased on your income and spending, here are my recommendations:\n\n**Recommended Monthly Savings:** ₹${suggestedSavings.toLocaleString()} (20% of budget)\n\n**Goal Ideas:**\n• 🏦 Emergency Fund: 3-6 months of expenses\n• 🎓 Skill Investment: Online courses, books\n• ✈️ Travel Fund: Start with ₹2,000/month\n• 💻 Tech Upgrade: Save over 6 months`;
      response.insights = [
        {
          type: 'tip',
          title: 'Suggested Savings',
          value: `₹${suggestedSavings.toLocaleString()}`,
          description: '20% of your budget'
        },
        {
          type: 'success',
          title: 'Annual Potential',
          value: `₹${(suggestedSavings * 12).toLocaleString()}`,
          description: 'If saved consistently'
        }
      ];
      response.suggestions = ['Create emergency fund', 'Track my goals', 'Automate savings'];
    }
    // Analyze Expenses
    else if (lowerQuery.includes('analyze') || lowerQuery.includes('breakdown') || lowerQuery.includes('detailed')) {
      const sortedCats = [...categories].sort((a: any, b: any) => b.spent - a.spent);
      const topCats = sortedCats.slice(0, 3);
      
      let analysisText = `🔍 **Expense Analysis**\n\n**Top 3 Spending Categories:**\n`;
      topCats.forEach((cat: any, i: number) => {
        const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
        const percent = ((cat.spent / spent) * 100).toFixed(1);
        analysisText += `${emoji} ${cat.name}: ₹${cat.spent.toLocaleString()} (${percent}%)\n`;
      });

      const recentExpenses = expenses.slice(0, 3);
      if (recentExpenses.length > 0) {
        analysisText += `\n**Recent Transactions:**\n`;
        recentExpenses.forEach((exp: any) => {
          analysisText += `• ₹${exp.amount} - ${exp.category} (${new Date(exp.date).toLocaleDateString()})\n`;
        });
      }

      response.content = analysisText;
      response.insights = topCats.slice(0, 2).map((cat: any) => ({
        type: 'tip' as const,
        title: cat.name,
        value: `₹${cat.spent.toLocaleString()}`,
        description: `${((cat.spent / cat.limit) * 100).toFixed(0)}% of limit`
      }));
      response.suggestions = ['Show all categories', 'Compare with last month', 'Find unusual spending'];
    }
    // On track check
    else if (lowerQuery.includes('track') || lowerQuery.includes('how am i doing') || lowerQuery.includes('progress')) {
      const status = percentageSpent < 50 ? 'excellent' : percentageSpent < 80 ? 'good' : 'needs attention';
      const emoji = status === 'excellent' ? '🌟' : status === 'good' ? '👍' : '⚠️';
      
      response.content = `${emoji} **Your Progress Report**\n\nYou've spent ${percentageSpent.toFixed(0)}% of your monthly budget.\n\n**Status:** ${status.charAt(0).toUpperCase() + status.slice(1)}\n**Remaining:** ₹${remaining.toLocaleString()}\n**Days Left:** ${30 - new Date().getDate()}\n\n${status === 'excellent' ? 'Amazing discipline! Keep it up! 🎉' : status === 'good' ? 'You\'re doing well. Stay mindful of spending.' : 'Consider cutting back on non-essential expenses.'}`;
      response.insights = [
        {
          type: status === 'excellent' ? 'success' : status === 'good' ? 'tip' : 'warning',
          title: 'Budget Used',
          value: `${percentageSpent.toFixed(0)}%`,
          description: `₹${remaining.toLocaleString()} left`
        }
      ];
      response.suggestions = ['Show tips to improve', 'See predictions', 'View categories'];
    }
    // Food / Groceries specific
    else if (lowerQuery.includes('food') || lowerQuery.includes('grocer') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant') || lowerQuery.includes('dining')) {
      const foodCat = categories.find((c: any) => c.name.toLowerCase().includes('food') || c.name.toLowerCase().includes('grocer'));
      response.content = `🍕 **Food & Dining Tips**\n\n${foodCat ? `You've spent **₹${foodCat.spent.toLocaleString()}** on ${foodCat.name} this month.\n\n` : ''}Here's how to save on food:\n\n• **Meal prep Sundays** - Cook in batches for the week\n• **Pack lunches** - Save ₹100-200 daily vs eating out\n• **Use food apps** - Zomato, Swiggy have student discounts\n• **Buy in bulk** - Rice, dal, and staples last longer\n• **Limit delivery** - Cooking costs 60% less`;
      response.insights = foodCat ? [{
        type: 'tip' as const,
        title: foodCat.name,
        value: `₹${foodCat.spent.toLocaleString()}`,
        description: `${((foodCat.spent / foodCat.limit) * 100).toFixed(0)}% of limit`
      }] : [];
      response.suggestions = ['Show all categories', 'More saving tips', 'Check my progress'];
    }
    // Transport specific
    else if (lowerQuery.includes('transport') || lowerQuery.includes('travel') || lowerQuery.includes('commute') || lowerQuery.includes('fuel') || lowerQuery.includes('uber') || lowerQuery.includes('ola')) {
      const transportCat = categories.find((c: any) => c.name.toLowerCase().includes('transport') || c.name.toLowerCase().includes('travel'));
      response.content = `🚗 **Transport & Travel Tips**\n\n${transportCat ? `You've spent **₹${transportCat.spent.toLocaleString()}** on ${transportCat.name} this month.\n\n` : ''}Ways to cut transport costs:\n\n• **Carpool with friends** - Split costs 50-75%\n• **Use public transport** - Often 80% cheaper\n• **Walk short distances** - Free and healthy!\n• **Book cabs in advance** - Avoid surge pricing\n• **Monthly passes** - Better value for regular commutes`;
      response.insights = transportCat ? [{
        type: 'tip' as const,
        title: transportCat.name,
        value: `₹${transportCat.spent.toLocaleString()}`,
        description: `${((transportCat.spent / transportCat.limit) * 100).toFixed(0)}% of limit`
      }] : [];
      response.suggestions = ['Show spending summary', 'More tips', 'Check budget'];
    }
    // Entertainment specific
    else if (lowerQuery.includes('entertain') || lowerQuery.includes('movie') || lowerQuery.includes('netflix') || lowerQuery.includes('subscription') || lowerQuery.includes('fun') || lowerQuery.includes('game')) {
      response.content = `🎮 **Entertainment & Subscriptions Tips**\n\nSmart ways to enjoy more, spend less:\n\n• **Share subscriptions** - Family plans cost less per person\n• **Free alternatives** - YouTube, Spotify free tier, library\n• **Student discounts** - Spotify, Apple Music offer 50% off\n• **Free events** - Check local events, college festivals\n• **Game sales** - Wait for Steam/Epic sales\n\n💡 **Audit tip:** List all subscriptions. Cancel what you haven't used in 30 days!`;
      response.suggestions = ['Check my subscriptions', 'Show spending', 'Set entertainment budget'];
    }
    // Shopping specific
    else if (lowerQuery.includes('shop') || lowerQuery.includes('buy') || lowerQuery.includes('purchase') || lowerQuery.includes('amazon') || lowerQuery.includes('flipkart') || lowerQuery.includes('clothes')) {
      response.content = `🛍️ **Smart Shopping Tips**\n\nShop smarter, not harder:\n\n• **24-hour rule** - Wait before impulse purchases\n• **Compare prices** - Use PriceHistory, CamelCamelCamel\n• **Wait for sales** - Big Billion Days, Prime Day, etc.\n• **Cashback apps** - CRED, Paytm have rewards\n• **Wishlist method** - Add to cart, wait a week, still want it?\n\n🎯 Ask yourself: "Do I need it, or do I want it?"`;
      response.suggestions = ['Show my expenses', 'Give budget tips', 'Check spending'];
    }
    // Default response - more varied
    else {
      const defaultResponses = [
        {
          content: `🤔 **Let me help you with that!**\n\nI noticed you asked about "${query}". Here's a quick snapshot:\n\n📊 **Your Budget:** ₹${totalBudget.toLocaleString()}\n💰 **Spent:** ₹${spent.toLocaleString()} (${percentageSpent.toFixed(0)}%)\n✨ **Remaining:** ₹${remaining.toLocaleString()}\n\nTry asking me specific questions like:\n• "Give me saving tips"\n• "Am I on track?"\n• "Show budget alerts"`,
          suggestions: ['Show tips', 'Check progress', 'View alerts']
        },
        {
          content: `💬 **I'm here to help!**\n\nYou can ask me things like:\n\n📊 "How much have I spent?"\n💡 "How can I save money?"\n⚠️ "Do I have any budget alerts?"\n📈 "What's my spending forecast?"\n🎯 "Help me set a goal"\n\nOr just say "help" for all options!`,
          suggestions: ['Spending summary', 'Saving tips', 'My progress']
        },
        {
          content: `✨ **Quick Budget Check**\n\nHere's where you stand:\n\n• **${percentageSpent.toFixed(0)}%** of budget used\n• **₹${remaining.toLocaleString()}** remaining\n• **${30 - new Date().getDate()} days** left in month\n\nWhat would you like to know more about?`,
          suggestions: ['Deep analysis', 'Get tips', 'See predictions']
        }
      ];
      const selected = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      response.content = selected.content;
      response.suggestions = selected.suggestions;
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

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
      }, 1000 + Math.random() * 1000);
    }, 100);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleQuickAction(suggestion);
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

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'from-amber-400 via-orange-500 to-red-500';
      case 'success': return 'from-emerald-400 via-green-500 to-teal-500';
      case 'tip': return 'from-cyan-400 via-blue-500 to-indigo-500';
      case 'prediction': return 'from-violet-400 via-purple-500 to-fuchsia-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div 
      className="min-h-screen pb-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fdf2f8 100%)' }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(139, 92, 246, 0.15)', top: '5rem', left: '-3rem' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(59, 130, 246, 0.12)', bottom: '10rem', right: '-3rem' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'rgba(236, 72, 153, 0.1)', top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-6rem)] relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 border-b"
          style={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(139, 92, 246, 0.15)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #d946ef)',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)'
                }}
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Bot className="w-7 h-7 text-white" />
              </motion.div>
              <motion.span 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full"
                style={{ 
                  background: 'linear-gradient(to right, #4ade80, #10b981)',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: '#1e1b4b' }}>
                Budget AI
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </motion.div>
              </h1>
              <p className="text-xs flex items-center gap-1.5" style={{ color: '#6b7280' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Your personal finance assistant
              </p>
            </div>
            <div 
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ 
                background: 'linear-gradient(to right, rgba(139,92,246,0.15), rgba(168,85,247,0.15))',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#7c3aed'
              }}
            >
              PRO ✨
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="px-3 py-3">
          <motion.div 
            className="grid grid-cols-3 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickAction(action.query)}
                className="px-2 py-2.5 rounded-xl text-[11px] font-medium transition-all text-center leading-tight"
                style={{
                  background: 'white',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#6366f1',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)'
                }}
              >
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4" style={{ scrollbarWidth: 'thin' }}>
          <AnimatePresence>
            {messages.map((message, msgIndex) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%]`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div 
                        whileHover={{ rotate: 10 }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ 
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </motion.div>
                      <span className="text-xs font-semibold" style={{ color: '#6366f1' }}>Budget AI</span>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>• just now</span>
                    </div>
                  )}
                  
                  {/* User message indicator */}
                  {message.type === 'user' && (
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-xs" style={{ color: '#9ca3af' }}>just now •</span>
                      <span className="text-xs font-semibold" style={{ color: '#8b5cf6' }}>You</span>
                    </div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-2xl p-4 relative overflow-hidden"
                    style={message.type === 'user' 
                      ? { 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                          color: 'white',
                          borderTopRightRadius: '4px',
                          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4), 0 4px 16px rgba(118, 75, 162, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }
                      : { 
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
                          color: '#374151',
                          borderTopLeftRadius: '4px',
                          border: '1px solid rgba(139, 92, 246, 0.12)'
                        }
                    }
                  >
                    {/* Decorative shine effect for user messages */}
                    {message.type === 'user' && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                          borderRadius: 'inherit'
                        }}
                      />
                    )}
                    {/* Subtle pattern for AI messages */}
                    {message.type === 'ai' && (
                      <div 
                        className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                          transform: 'translate(30%, -30%)'
                        }}
                      />
                    )}
                    <div 
                      className="text-sm leading-relaxed relative z-10" 
                      style={{ 
                        color: message.type === 'user' ? 'white' : '#4b5563',
                        textShadow: message.type === 'user' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        fontWeight: message.type === 'user' ? 500 : 400
                      }}
                    >
                      {message.type === 'ai' ? parseMarkdown(message.content) : message.content}
                    </div>
                  </motion.div>

                  {/* Insight Cards */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.insights.map((insight, i) => {
                        const Icon = getInsightIcon(insight.type);
                        const colors = {
                          warning: { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', icon: '#d97706', title: '#92400e', value: '#78350f', desc: '#a16207' },
                          success: { bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', icon: '#059669', title: '#047857', value: '#064e3b', desc: '#10b981' },
                          tip: { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', icon: '#2563eb', title: '#1d4ed8', value: '#1e3a8a', desc: '#3b82f6' },
                          prediction: { bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', icon: '#7c3aed', title: '#6d28d9', value: '#4c1d95', desc: '#8b5cf6' }
                        };
                        const colorSet = colors[insight.type as keyof typeof colors] || colors.tip;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="p-3 rounded-xl relative overflow-hidden cursor-pointer"
                            style={{ 
                              background: colorSet.bg,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }}
                          >
                            <div 
                              className="absolute top-0 right-0 w-16 h-16 rounded-full"
                              style={{ background: 'rgba(255,255,255,0.5)', marginRight: '-2rem', marginTop: '-2rem' }}
                            />
                            <Icon className="w-5 h-5 mb-1.5" style={{ color: colorSet.icon }} />
                            <p className="text-xs font-medium mb-0.5" style={{ color: colorSet.title }}>{insight.title}</p>
                            <p className="font-bold text-lg" style={{ color: colorSet.value }}>{insight.value}</p>
                            <p className="text-[11px] leading-tight mt-0.5" style={{ color: colorSet.desc }}>{insight.description}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <motion.div 
                      className="mt-3 flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {message.suggestions.map((suggestion, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            color: '#7c3aed'
                          }}
                        >
                          {suggestion}
                          <ArrowRight className="w-3 h-3" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2"
              >
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(to bottom right, #8b5cf6, #d946ef)' }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div 
                  className="rounded-2xl rounded-tl px-4 py-3"
                  style={{ 
                    background: 'white',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)'
                  }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#a855f7' }}
                        animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3"
          style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(139, 92, 246, 0.1)'
          }}
        >
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your budget..."
                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                style={{
                  background: 'white',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#374151',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.08)'
                }}
              />
              <Sparkles 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" 
                style={{ color: inputValue ? '#a855f7' : '#d1d5db' }}
              />
            </div>
            <motion.button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ 
                background: 'linear-gradient(to bottom right, #8b5cf6, #a855f7, #d946ef)',
                boxShadow: '0 8px 25px rgba(168, 85, 247, 0.35)'
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          <p 
            className="text-center text-xs mt-2 flex items-center justify-center gap-1.5"
            style={{ color: '#9ca3af' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            AI-Powered • Private & Secure
          </p>
        </motion.div>
      </div>
    </div>
  );
}
