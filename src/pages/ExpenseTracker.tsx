import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReceiptRefundIcon as ReceiptIcon, TagIcon } from '@heroicons/react/24/solid';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  tags: string[];
  date: string;
}

const categories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health & Wellness',
  'Other',
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const fetchExpenses = async () => {
    try {
      if (!token) {
        throw new Error('Please login first');
      }
      const response = await api.get('/api/expenses', {
        headers: { 'x-auth-token': token }
      });
      const data = response.data;
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const expenseData = {
      amount: Number(formData.get('amount')),
      category: formData.get('category'),
      description: formData.get('description'),
      tags,
      date: new Date().toISOString(),
    };

    try {
      if (!token) {
        throw new Error('Please login first');
      }
      const response = await api.post('/api/expenses', expenseData, {
        headers: { 'x-auth-token': token }
      });

      const newExpense = response.data;
      setExpenses([newExpense, ...expenses]);
      form.reset();
      setTags([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="bg-main min-h-screen py-6 px-4">
      <div className="space-y-6 animate-fadeIn">
        <div className="grid gap-6 lg:grid-cols-12">
        {/* Add Expense Form */}
        <div className="lg:col-span-5">
          <div className="form-card">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Add Expense</h2>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4361ee]/10">
                <ReceiptIcon className="h-5 w-5 text-[#4361ee]" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-lg bg-[#f72585]/10 p-4 text-[#f72585]">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  min="0"
                  step="1"
                  required
                  className="input-field"
                  placeholder="Enter expense amount"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  required
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  className="input-field"
                  placeholder="Add a description"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (Optional)
                </label>
                <div className="mt-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[#4361ee]/10 px-2.5 py-0.5 text-xs font-medium text-[#4361ee]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#4361ee]/20"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type and press Enter to add tags"
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2" />
                    Adding...
                  </div>
                ) : (
                  'Add Expense'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Expenses List */}
        <div className="lg:col-span-7">
          <div className="form-card">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Recent Expenses</h2>
              <span className="text-sm text-gray-500">{expenses.length} total</span>
            </div>

            <div className="mt-6 space-y-4">
              {expenses.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
                  <ReceiptIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900">No expenses recorded</p>
                  <p className="mt-1 text-sm text-gray-500">Start adding your expenses using the form</p>
                </div>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-start justify-between rounded-lg border border-gray-100 p-4 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4361ee]/10">
                        <TagIcon className="h-5 w-5 text-[#4361ee]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{expense.category}</p>
                          <time className="text-xs text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </time>
                        </div>
                        {expense.description && (
                          <p className="mt-1 text-sm text-gray-600">{expense.description}</p>
                        )}
                        {expense.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {expense.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-[#4cc9f0]/10 px-2 py-0.5 text-xs font-medium text-[#4cc9f0]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
