import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BanknotesIcon as PiggyBankIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  LightBulbIcon,
  SparklesIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/solid';
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
    <div className="bg-main min-h-screen py-6 px-4">
      <div className="space-y-6 animate-fadeIn">
        {/* Overall Progress */}
        <div className="stats-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Savings Goals</h2>
            <p className="mt-1 text-sm text-gray-600">Track your progress towards financial goals</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4361ee]/10">
            <PiggyBankIcon className="h-6 w-6 text-[#4361ee]" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Savings</p>
              <p className="mt-1 text-2xl font-semibold text-[#4361ee]">
                ₹{savingsData.currentSavings.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Goal</p>
              <p className="mt-1 text-2xl font-semibold text-[#4cc9f0]">
                ₹{savingsData.savingsGoal.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{savingsPercentage.toFixed(1)}% Complete</span>
              <span className="text-gray-500">
                ₹{(savingsData.savingsGoal - savingsData.currentSavings).toLocaleString()} remaining
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#4361ee] to-[#4cc9f0] transition-all duration-500"
                style={{ width: `${savingsPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Savings */}
        <div className="stats-card">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
          <div className="mt-6 grid gap-6">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4361ee]/10">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-[#4361ee]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Monthly Target</p>
                  <p className="text-xs text-gray-500">Recommended savings</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                ₹{savingsData.monthlySavings.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4cc9f0]/10">
                  <CalendarIcon className="h-5 w-5 text-[#4cc9f0]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Time to Goal</p>
                  <p className="text-xs text-gray-500">At current rate</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {Math.ceil((savingsData.savingsGoal - savingsData.currentSavings) / savingsData.monthlySavings)} months
              </p>
            </div>
          </div>
        </div>

        {/* Smart Tips */}
        <div className="form-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Smart Tips</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4cc9f0]/10">
              <LightBulbIcon className="h-4 w-4 text-[#4cc9f0]" />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {savingsData.recommendations.map((tip, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 rounded-lg border border-gray-100 p-4 transition-all hover:bg-gray-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4361ee]/10">
                  <SparklesIcon className="h-4 w-4 text-[#4361ee]" />
                </div>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="form-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <p className="mt-1 text-sm text-gray-600">Download your savings data for analysis</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4361ee]/10">
            <ArrowDownTrayIcon className="h-5 w-5 text-[#4361ee]" />
          </div>
        </div>

        <div className="mt-6 flex items-end space-x-4">
          <div className="flex-1">
            <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700">
              Export Format
            </label>
            <select
              id="exportFormat"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
              className="input-field mt-1"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <button onClick={handleExportData} className="btn-primary">
            Export Data
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
