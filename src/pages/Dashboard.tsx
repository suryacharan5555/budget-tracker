import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ArrowUpIcon, CurrencyRupeeIcon, ChartPieIcon } from '@heroicons/react/24/solid';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStats {
  totalBudget: number;
  totalExpenses: number;
  totalSavings: number;
  remainingBudget: number;
  dailyBudget: number;
  remainingDays: number;
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

        // Calculate remaining days in current month
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const remainingDays = lastDayOfMonth.getDate() - today.getDate() + 1;
        
        // Calculate daily budget from remaining budget
        const dailyBudget = remainingBudget / remainingDays;

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
          dailyBudget,
          remainingDays,
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
    <div className="space-y-6 bg-main min-h-screen py-6 px-4">
      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stats-card">
          <h3 className="text-sm font-medium text-gray-500">Monthly Income</h3>
          <p className="mt-2 text-3xl font-semibold text-[#4361ee]">
            ₹{stats.totalBudget.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <CurrencyRupeeIcon className="h-4 w-4 text-[#4361ee]" />
            <span className="ml-1">Available for spending</span>
          </div>
        </div>

        <div className="stats-card">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="mt-2 text-3xl font-semibold text-[#f72585]">
            ₹{stats.totalExpenses.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span className="flex items-center">
              <ArrowUpIcon className="h-4 w-4 text-[#f72585]" />
              <span className="ml-1">
                {((stats.totalExpenses / stats.totalBudget) * 100).toFixed(1)}% of budget
              </span>
            </span>
          </div>
        </div>

        <div className="stats-card">
          <h3 className="text-sm font-medium text-gray-500">Daily Budget</h3>
          <p className="mt-2 text-3xl font-semibold text-[#4cc9f0]">
            ₹{stats.dailyBudget.toFixed(0)}
          </p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>{stats.remainingDays} days remaining</span>
            <span>₹{stats.remainingBudget.toLocaleString()} left</span>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="chart-card">
          <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
          <div className="mt-6 h-[300px]">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="form-card">
          <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expenses</span>
                <span className="font-medium">{((stats.totalExpenses / stats.totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-[#f72585]"
                  style={{ width: `${(stats.totalExpenses / stats.totalBudget) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Savings</span>
                <span className="font-medium">{((stats.totalSavings / stats.totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-[#4cc9f0]"
                  style={{ width: `${(stats.totalSavings / stats.totalBudget) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining</span>
                <span className="font-medium">{((stats.remainingBudget / stats.totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-[#4361ee]"
                  style={{ width: `${(stats.remainingBudget / stats.totalBudget) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Link to="/expenses">
              <button className="btn-primary">Track Expenses</button>
            </Link>
            <Link to="/setup">
              <button className="btn-secondary">Update Budget</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="chart-card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Link to="/expenses">
            <button className="btn-secondary">View All</button>
          </Link>
        </div>
        <div className="mt-6 space-y-3">
          {stats.expensesByCategory.slice(0, 5).map((category) => (
            <div key={category.category} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4361ee]/10">
                  <ChartPieIcon className="h-4 w-4 text-[#4361ee]" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{category.category}</p>
                  <p className="text-xs text-gray-500">Category</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">₹{category.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
