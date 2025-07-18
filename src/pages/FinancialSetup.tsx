import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="financial-setup min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Setup</h2>
          <p className="mt-2 text-gray-600">
            Set up your monthly budget to help you track your expenses and savings effectively.
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Details</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="monthlyIncome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    id="monthlyIncome"
                    min="0"
                    step="100"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your monthly income"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mandatoryExpenses"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mandatory Expenses (₹)
                  </label>
                  <input
                    type="number"
                    name="mandatoryExpenses"
                    id="mandatoryExpenses"
                    min="0"
                    step="100"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your mandatory expenses"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Include rent, utilities, loan payments, etc.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="savingsGoal"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Monthly Savings Goal (₹)
                  </label>
                  <input
                    type="number"
                    name="savingsGoal"
                    id="savingsGoal"
                    min="0"
                    step="100"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your savings goal"
                  />
                </div>

                <div>
                  <label
                    htmlFor="daysInMonth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Days in Month
                  </label>
                  <select
                    name="daysInMonth"
                    id="daysInMonth"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="28">28 days</option>
                    <option value="29">29 days</option>
                    <option value="30">30 days</option>
                    <option value="31">31 days</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLoading ? 'Saving...' : 'Save Setup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
