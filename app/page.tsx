'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Expense එකක හැඩය (Type) ලියාගමු
interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // 1. ඩේටාබේස් එකේ තියෙන වියදම් ටික කියවාගන්නා (Fetch) Function එක
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('id', { ascending: false }); // අලුතින්ම දාන ඒවා උඩට එන්න

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setExpenses(data || []);
    }
  };

  // පිටුව මුලින්ම ලෝඩ් වෙද්දී දත්ත ටික අරන් එන්න කියමු
  useEffect(() => {
    fetchExpenses();
  }, []);

  // 2. අලුත් වියදමක් ඇතුළත් කිරීම
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return alert('කරුණාකර සියලුම විස්තර පුරවන්න!');

    setLoading(true);

    const { error } = await supabase
      .from('expenses')
      .insert([
        { 
          title: title, 
          amount: parseFloat(amount), 
          category: category 
        }
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('දත්ත ඇතුළත් කිරීමේදී දෝෂයක් සිදුවුණා!');
    } else {
      alert('වියාදම සාර්ථකව ඇතුළත් කරා!');
      setTitle('');
      setAmount('');
      fetchExpenses(); // ඇඩ් කරපු ගමන් ලිස්ට් එක ලයිව් අප්ඩේට් කරන්න
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-100 text-gray-800 gap-6">
      {/* 🔴 EXPENSE INPUT FORM */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Expense Tracker</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expense Title (වියදම)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="උදා: Rice & Curry, Bus Fare"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (මුදල Rs.)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category (වර්ගය)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Saving...' : 'Add Expense'}
          </button>
        </form>
      </div>

      {/* 🔴 EXPENSE LIST SHOWING FROM DATABASE */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">වියදම් ලැයිස්තුව (History)</h2>
        
        {expenses.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">තවම වියදම් ඇතුළත් කර නැත.</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
            {expenses.map((exp) => (
              <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{exp.title}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                    {exp.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-red-500">Rs. {exp.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400">{exp.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}