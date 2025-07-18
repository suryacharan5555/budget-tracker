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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Financial Setup</h2>
          <p className="mt-2 text-gray-600">
            Set up your monthly budget to help you track your expenses and savings effectively.
          </p>
        </div>

        <div className="rounded-lg bg-white/80 backdrop-blur-sm p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Budget Details</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50/80 backdrop-blur-sm p-4 border-l-4 border-red-500">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="monthlyIncome"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your monthly income"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mandatoryExpenses"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your mandatory expenses"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Include rent, utilities, loan payments, etc.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="savingsGoal"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your savings goal"
                  />
                </div>

                <div>
                  <label
                    htmlFor="daysInMonth"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Days in Month
                  </label>
                  <select
                    name="daysInMonth"
                    id="daysInMonth"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white/50 backdrop-blur-sm"
                  >
                    <option value="28">28 days</option>
                    <option value="29">29 days</option>
                    <option value="30">30 days</option>
                    <option value="31">31 days</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white/80 hover:bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
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
