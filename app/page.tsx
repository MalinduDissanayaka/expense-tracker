'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import TotalExpenseCard from '../components/TotalExpenseCard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilters from '../components/ExpenseFilters';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  user_id: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const router = useRouter();

  // Check user authentication status on load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login if user is not authenticated
        router.push('/login');
      } else {
        setUser(user);
        fetchExpenses(user.id);
      }
      setAuthLoading(false);
    };
    checkUser();
  }, [router]);

  // Fetch expenses belonging only to the logged-in user
  const fetchExpenses = async (userId: string) => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId) // Filter by current user ID
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setExpenses(data || []);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Filtering Logic based on user selection
  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const expenseMonth = exp.date ? exp.date.split('-')[1] : '';
    const matchesMonth = selectedMonth === 'All' || expenseMonth === selectedMonth;
    return matchesCategory && matchesMonth;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading Session...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-100 text-gray-800 gap-6">
      
      {/* Header with User Info and Logout Button */}
      <div className="w-full max-w-md flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="overflow-hidden mr-2">
          <p className="text-xs text-gray-400">Logged in as:</p>
          <p className="text-sm font-semibold text-gray-700 truncate" title={user?.email}>{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors whitespace-nowrap"
        >
          Logout
        </button>
      </div>

      <TotalExpenseCard expenses={filteredExpenses} />

      {/* Pass fetchExpenses with userId so the form knows how to refresh */}
      <ExpenseForm onExpenseAdded={() => fetchExpenses(user.id)} />

      <ExpenseFilters 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <ExpenseList expenses={filteredExpenses} onExpenseDeleted={() => fetchExpenses(user.id)} />
    </main>
  );
}