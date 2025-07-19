import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  HomeIcon,
  CurrencyRupeeIcon,
  ChartPieIcon,
  BanknotesIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Financial Setup', href: '/setup', icon: CurrencyRupeeIcon },
    { name: 'Expenses', href: '/expenses', icon: ChartPieIcon },
    { name: 'Savings', href: '/savings', icon: BanknotesIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-[#4361ee]">BudgetWise</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#4361ee] text-white flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        {/* Navigation */}
        <div className="border-t">
          <div className="flex space-x-1 px-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-b-2 border-[#4361ee] text-[#4361ee]'
                      : 'text-gray-600 hover:text-[#4361ee]'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-32 px-8 pb-8">
        <div className="animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
