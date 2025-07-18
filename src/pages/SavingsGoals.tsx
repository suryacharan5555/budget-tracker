import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface SavingsData {
  currentSavings: number;
  savingsGoal: number;
  monthlySavings: number;
  recommendations: string[];
}

export default function SavingsGoals() {
  const [savingsData, setSavingsData] = useState<SavingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    try {
      if (!token) {
        throw new Error('Please login first');
      }
      const response = await api.get('/api/savings', {
        headers: { 'x-auth-token': token }
      });
      const data = response.data;
      setSavingsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch savings data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/export?format=${exportFormat}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-tracker-export.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Loading savings data...</p>
      </div>
    );
  }

  if (!savingsData) {
    return (
      <div className="text-center">
        <p className="text-gray-600">No savings data available.</p>
      </div>
    );
  }

  const savingsPercentage = Math.min(
    (savingsData.currentSavings / savingsData.savingsGoal) * 100,
    100
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Savings Goals</h2>
        <p className="text-gray-600">Track your progress towards savings goals.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Savings Progress
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">
                    Current Savings
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{savingsData.currentSavings.toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${savingsPercentage}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <p className="text-gray-600">
                    {savingsPercentage.toFixed(1)}% of goal
                  </p>
                  <p className="font-medium text-gray-900">
                    Goal: ₹{savingsData.savingsGoal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Savings
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ₹{savingsData.monthlySavings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Smart Tips</h3>
            <div className="mt-4 space-y-4">
              {savingsData.recommendations.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 rounded-lg bg-primary/5 p-4"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="exportFormat"
                  className="block text-sm font-medium text-gray-700"
                >
                  Export Format
                </label>
                <select
                  id="exportFormat"
                  value={exportFormat}
                  onChange={(e) =>
                    setExportFormat(e.target.value as 'csv' | 'json')
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <button
                onClick={handleExportData}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Export Data
              </button>

              <p className="text-sm text-gray-500">
                Download your budget and expense data for backup or analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
