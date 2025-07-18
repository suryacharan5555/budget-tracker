import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStats {
  totalBudget: number;
  totalExpenses: number;
  totalSavings: number;
  remainingBudget: number;
  expensesByCategory: {
    category: string;
    amount: number;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token) {
          throw new Error('Please login first');
        }
        const [budgetResponse, expensesResponse] = await Promise.all([
          api.get('/api/budget', {
            headers: { 'x-auth-token': token }
          }),
          api.get('/api/expenses', {
            headers: { 'x-auth-token': token }
          })
        ]);

        const budget = budgetResponse.data;
        const expenses = expensesResponse.data;

        // Calculate dashboard stats
        const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
        const totalSavings = budget.savingsGoal || 0;
        const remainingBudget = budget.monthlyIncome - totalExpenses - totalSavings;

        // Group expenses by category
        const expensesByCategory = expenses.reduce((acc: any[], expense: any) => {
          const existing = acc.find(item => item.category === expense.category);
          if (existing) {
            existing.amount += expense.amount;
          } else {
            acc.push({ category: expense.category, amount: expense.amount });
          }
          return acc;
        }, []);

        setStats({
          totalBudget: budget.monthlyIncome,
          totalExpenses,
          totalSavings,
          remainingBudget,
          expensesByCategory
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to Budget Tracker
        </h1>
        <p className="text-gray-600">Let's start by setting up your budget!</p>
        <Link
          to="/setup"
          className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Set Up Budget
        </Link>
      </div>
    );
  }

  const chartData = {
    labels: stats.expensesByCategory.map((item) => item.category),
    datasets: [
      {
        data: stats.expensesByCategory.map((item) => item.amount),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{stats.totalBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600">
                ₹{stats.totalExpenses.toLocaleString()}
              </p>
            </div>
            <ArrowUpIcon className="h-5 w-5 text-red-500" />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-semibold text-green-600">
                ₹{stats.totalSavings.toLocaleString()}
              </p>
            </div>
            <ArrowUpIcon className="h-5 w-5 text-green-500" />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Remaining Budget
              </p>
              <p
                className={`text-2xl font-semibold ${
                  stats.remainingBudget >= 0
                    ? 'text-gray-900'
                    : 'text-red-600'
                }`}
              >
                ₹{stats.remainingBudget.toLocaleString()}
              </p>
            </div>
            {stats.remainingBudget >= 0 ? (
              <ArrowUpIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Expenses by Category
          </h3>
          <div className="h-64">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Category Breakdown
          </h3>
          <div className="space-y-4">
            {stats.expensesByCategory.map((category) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{category.category}</span>
                <span className="font-medium text-gray-900">
                  ₹{category.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
