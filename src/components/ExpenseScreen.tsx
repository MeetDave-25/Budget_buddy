import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { CategoryIcon } from './CategoryIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Upload, Filter, ArrowUpDown, Pencil, Trash2, Plus, Receipt } from 'lucide-react';

interface ExpenseScreenProps {
  userData: any;
  onAddExpense: (expense: any) => void;
  onUpdateExpense: (expenseId: string, updatedExpense: any) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export function ExpenseScreen({ userData, onAddExpense, onUpdateExpense, onDeleteExpense }: ExpenseScreenProps) {
  const [showForm, setShowForm] = useState(true);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleSubmit = () => {
    if (amount && category) {
      onAddExpense({
        amount: Number(amount),
        category,
        date,
        notes,
        categoryColor: userData.categories.find((c: any) => c.name === category)?.color || 'bg-gray-100',
      });
      setAmount('');
      setCategory('');
      setNotes('');
      setShowForm(false);
      setTimeout(() => setShowForm(true), 300);
    }
  };

  const handleEditClick = (expense: any) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditDate(expense.date);
    setEditNotes(expense.notes || '');
  };

  const handleEditSubmit = (expenseId: string) => {
    if (editAmount && editCategory) {
      onUpdateExpense(expenseId, {
        amount: Number(editAmount),
        category: editCategory,
        date: editDate,
        notes: editNotes,
        categoryColor: userData.categories.find((c: any) => c.name === editCategory)?.color || 'bg-gray-100',
      });
      setEditingId(null);
    }
  };

  const handleEditCancel = () => setEditingId(null);

  const handleDeleteClick = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      onDeleteExpense(expenseId);
    }
  };

  const filteredExpenses = userData.expenses.filter((exp: any) =>
    filterCategory === 'All' || exp.category === filterCategory
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'amount') return b.amount - a.amount;
    return 0;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        </div>
        <p className="text-muted-foreground">Manage and track your expenses</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form (Sticky on Desktop) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 glass-card border-primary/20">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      New Transaction
                    </h3>
                    
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Amount</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">₹</span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-8 h-12 text-lg font-semibold bg-white/5 border-white/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Category</label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="h-12 bg-white/5 border-white/10">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-white/10">
                            {userData.categories.map((cat: any) => (
                              <SelectItem key={cat.name} value={cat.name} className="focus:bg-white/10">
                                <div className="flex items-center gap-2">
                                  <CategoryIcon category={cat.name} className="w-4 h-4" />
                                  {cat.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Date</label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="h-12 bg-white/5 border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Notes</label>
                        <Textarea
                          placeholder="What was this for?"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="bg-white/5 border-white/10 resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="border border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-white/5 transition-colors group">
                        <Upload className="w-5 h-5 mx-auto mb-2 text-white/50 group-hover:text-primary transition-colors" />
                        <p className="text-xs text-white/50 font-medium">Upload Receipt (Optional)</p>
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={!amount || !category}
                        className="w-full h-12 text-base font-semibold shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                      >
                        Save Transaction
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="All">All Categories</SelectItem>
                {userData.categories.map((cat: any) => (
                  <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-primary" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="amount">Sort by Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="p-2 sm:p-6 glass-card">
            <div className="flex justify-between items-center mb-6 px-2 sm:px-0">
              <h3 className="text-lg font-semibold">Transaction History</h3>
              <Badge variant="outline" className="bg-white/5 border-white/10">{sortedExpenses.length} Total</Badge>
            </div>
            
            <div className="space-y-2">
              <AnimatePresence>
                {sortedExpenses.map((expense: any, i: number) => (
                  <motion.div
                    key={expense.id || i}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all group"
                  >
                    {editingId === expense.id ? (
                      <div className="space-y-4 p-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-white/50">Amount</label>
                            <Input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-white/50">Category</label>
                            <Select value={editCategory} onValueChange={setEditCategory}>
                              <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass-card border-white/10">
                                {userData.categories.map((cat: any) => (
                                  <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-white/50">Date</label>
                            <Input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-white/50">Notes</label>
                            <Input
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Optional notes..."
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-4">
                          <Button variant="ghost" onClick={handleEditCancel} className="text-white/70">Cancel</Button>
                          <Button onClick={() => handleEditSubmit(expense.id)} disabled={!editAmount || !editCategory}>Save Changes</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center sm:items-start gap-4">
                        <div className="flex items-center sm:items-start gap-4 flex-1">
                          <div className={`p-3 rounded-xl bg-white/10 flex-shrink-0`}>
                            <CategoryIcon category={expense.category} className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-base font-medium text-white line-clamp-1">{expense.notes || expense.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-white/70">{expense.category}</span>
                              <span className="text-xs text-white/40">{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-lg font-bold text-white whitespace-nowrap">-₹{expense.amount.toLocaleString()}</p>
                          <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 hover:bg-white/10"
                              onClick={() => handleEditClick(expense)}
                            >
                              <Pencil className="w-4 h-4 text-white/70" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 hover:bg-destructive/20 hover:text-destructive"
                              onClick={() => handleDeleteClick(expense.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {sortedExpenses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 mb-4 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Receipt className="w-8 h-8 text-white/20" />
                  </div>
                  <h4 className="text-lg font-medium text-white/90 mb-1">No transactions found</h4>
                  <p className="text-sm text-white/50 max-w-[250px]">
                    {filterCategory !== 'All' 
                      ? `You haven't added any ${filterCategory} expenses yet.`
                      : "Start adding your expenses to track your spending habits."}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
