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
      .eq('user_id', userId)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setExpenses(data || []);
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-gray-600">Loading Session...</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Welcome & Introduction Banner */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">Welcome back! Manage and review your daily expenditures efficiently.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-md border border-blue-100 max-w-xs truncate">
          <span className="text-[10px] text-blue-500 font-bold uppercase block tracking-wider">Active Account</span>
          <span className="text-sm font-semibold text-gray-700 truncate block" title={user?.email}>{user?.email}</span>
        </div>
      </div>

      {/* 🚀 TWO-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls & Input (Occupies 5 columns on large screens) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Expense Input Form Card */}
          <div className="w-full">
            <ExpenseForm onExpenseAdded={() => fetchExpenses(user.id)} />
          </div>
          
          {/* Filters Card */}
          <div className="w-full">
            <ExpenseFilters 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & History (Occupies 7 columns on large screens) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {/* Total Summary Card */}
          <div className="w-full">
            <TotalExpenseCard expenses={filteredExpenses} />
          </div>

          {/* Expense History List Card (Custom styled wrapper to control structure) */}
          <div className="w-full shadow-md bg-white rounded-lg border border-gray-100 overflow-hidden">
            <ExpenseList expenses={filteredExpenses} onExpenseDeleted={() => fetchExpenses(user.id)} />
          </div>
        </div>

      </div>
    </main>
  );
}