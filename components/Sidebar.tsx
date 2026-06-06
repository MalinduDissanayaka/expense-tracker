'use client';

import { supabase } from '../lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current active route

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Sidebar navigation menu items
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Budgets', path: '/budgets' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col justify-between p-4 sticky top-0 transition-colors duration-200">
      <div className="flex flex-col gap-6">
        {/* App Logo/Title */}
        <div className="p-2 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-blue-600 tracking-wide">ExpenseTracker</h2>
          <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">Fintech Dashboard</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action at the bottom */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-left transition-colors flex items-center gap-2 dark:text-red-400"
        >
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}