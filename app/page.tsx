'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import TotalExpenseCard from '../components/TotalExpenseCard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilters from '../components/ExpenseFilters'; // 👈 අලුත් Component එක Import කරා

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Filters සඳහා State දෙකක් හදාගමු
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

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

  // 💡 මෙන්න මෙතනදී තමයි යූසර් තෝරන Filter එක අනුව දත්ත ටික පෙරා ගන්නේ (Filtering Logic)
  const filteredExpenses = expenses.filter((exp) => {
    // 1. Category එක ගැලපෙනවාද බලන්න
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    
    // 2. මාසය ගැලපෙනවාද බලන්න (exp.date එකෙන් 'YYYY-MM-DD' මැද තියෙන MM කෑල්ල ගන්නවා)
    const expenseMonth = exp.date ? exp.date.split('-')[1] : '';
    const matchesMonth = selectedMonth === 'All' || expenseMonth === selectedMonth;

    return matchesCategory && matchesMonth;
  });

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-100 text-gray-800 gap-6">
      
      {/* 💳 Total Expense Card එකට දෙන්නේ Filter වෙච්ච ලිස්ට් එක (එතකොට Total එකත් Filter එකට අනුව වෙනස් වෙනවා) */}
      <TotalExpenseCard expenses={filteredExpenses} />

      {/* 📝 Expense Input Form */}
      <ExpenseForm onExpenseAdded={fetchExpenses} />

      {/* 🔍 FEATURE: Expense Filters Component */}
      <ExpenseFilters 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {/* 📋 Expense List එකටත් දෙන්නේ Filter වෙච්ච ලිස්ට් එක */}
      <ExpenseList expenses={filteredExpenses} onExpenseDeleted={fetchExpenses} />
    </main>
  );
}