import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { CategoryIcon } from './CategoryIcon';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Upload, Filter, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

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

  // Edit form state
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

  // Track which expense is being edited (null = none)
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleEditCancel = () => {
    setEditingId(null);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 pb-24">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4"
        >
          <h1 className="text-2xl mb-1">Track Expenses 💸</h1>
          <p className="text-muted-foreground text-sm">Add and manage your spending</p>
        </motion.div>

        {/* Add Expense Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="mb-4">Add New Expense</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-xl"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {userData.categories.map((cat: any) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon category={cat.name} className="w-4 h-4" />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Notes (optional)</label>
                  <Textarea
                    placeholder="E.g., Lunch at campus cafeteria"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload Receipt (Coming Soon)</p>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!amount || !category}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Add Expense
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {userData.categories.map((cat: any) => (
                <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="amount">Sort by Amount</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="mb-4">All Expenses ({sortedExpenses.length})</h3>
            <div className="space-y-3">
              {sortedExpenses.map((expense: any, i: number) => (
                <motion.div
                  key={expense.id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  {editingId === expense.id ? (
                    // INLINE EDIT FORM
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Amount</label>
                          <Input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Category</label>
                          <Select value={editCategory} onValueChange={setEditCategory}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {userData.categories.map((cat: any) => (
                                <SelectItem key={cat.name} value={cat.name}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Date</label>
                        <Input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Notes</label>
                        <Input
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Optional notes..."
                          className="h-8"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSubmit(expense.id)}
                          disabled={!editAmount || !editCategory}
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // NORMAL VIEW
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${expense.categoryColor} mt-1`}>
                          <CategoryIcon category={expense.category} className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{expense.notes || expense.category}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {expense.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{expense.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">₹{expense.amount}</p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(expense)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
              {sortedExpenses.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No expenses yet</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
