'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import TotalExpenseCard from '@/components/TotalExpenseCard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setExpenses(data || []);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-100 text-gray-800 gap-6">
      {/* 💳 Total Expense Card Component */}
      <TotalExpenseCard expenses={expenses} />

      {/* 📝 Expense Input Form Component */}
      <ExpenseForm onExpenseAdded={fetchExpenses} />

      {/* 📋 Expense List Component */}
      <ExpenseList expenses={expenses} onExpenseDeleted={fetchExpenses} />
    </main>
  );
}