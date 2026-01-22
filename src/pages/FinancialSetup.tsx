import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencyRupeeIcon } from '@heroicons/react/24/solid';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface FinancialData {
  monthlyIncome: number;
  mandatoryExpenses: number;
  savingsGoal: number;
  daysInMonth: number;
}

export default function FinancialSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const financialData: FinancialData = {
      monthlyIncome: Number(formData.get('monthlyIncome')),
      mandatoryExpenses: Number(formData.get('mandatoryExpenses')),
      savingsGoal: Number(formData.get('savingsGoal')),
      daysInMonth: Number(formData.get('daysInMonth')),
    };

    try {
      if (!token) {
        throw new Error('Please login first');
      }
      const response = await api.post('/api/budget', financialData, {
        headers: { 'x-auth-token': token }
      });
      if (!response.data) {
        throw new Error('Failed to save financial setup');
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-main min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className="form-card">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">Financial Setup</h2>
          <p className="text-gray-600">
            Configure your monthly budget to effectively track expenses and savings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {error && (
            <div className="rounded-lg bg-[#f72585]/10 p-4 text-[#f72585]">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  name="monthlyIncome"
                  id="monthlyIncome"
                  min="0"
                  step="100"
                  required
                  className="input-field"
                  placeholder="Enter your monthly income"
                />
              </div>

              <div>
                <label htmlFor="mandatoryExpenses" className="block text-sm font-medium text-gray-700">
                  Mandatory Expenses (₹)
                </label>
                <input
                  type="number"
                  name="mandatoryExpenses"
                  id="mandatoryExpenses"
                  min="0"
                  step="100"
                  required
                  className="input-field"
                  placeholder="Enter your mandatory expenses"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Include rent, utilities, loan payments, etc.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700">
                  Monthly Savings Goal (₹)
                </label>
                <input
                  type="number"
                  name="savingsGoal"
                  id="savingsGoal"
                  min="0"
                  step="100"
                  required
                  className="input-field"
                  placeholder="Enter your savings goal"
                />
              </div>

              <div>
                <label htmlFor="daysInMonth" className="block text-sm font-medium text-gray-700">
                  Days in Month
                </label>
                <select
                  name="daysInMonth"
                  id="daysInMonth"
                  required
                  className="input-field"
                  defaultValue="30"
                >
                  <option value="28">28 days</option>
                  <option value="29">29 days</option>
                  <option value="30">30 days</option>
                  <option value="31">31 days</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6">
            {isLoading && (
              <div className="loading-spinner" />
            )}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Saving...' : 'Save Setup'}
            </button>
          </div>
        </form>
      </div>

      <div className="stats-card">
        <h3 className="text-lg font-semibold text-gray-900">Budget Tips</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4361ee]/10">
                <CurrencyRupeeIcon className="h-4 w-4 text-[#4361ee]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">50/30/20 Rule</p>
              <p className="text-sm text-gray-600">
                Allocate 50% for needs, 30% for wants, and 20% for savings.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4cc9f0]/10">
                <CurrencyRupeeIcon className="h-4 w-4 text-[#4cc9f0]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Emergency Fund</p>
              <p className="text-sm text-gray-600">
                Aim to save 3-6 months of expenses for emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
