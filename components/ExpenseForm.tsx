'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return alert('Please fill in all details!');

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('User session not found. Please log in again.');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('expenses')
      .insert([
        { 
          title, 
          amount: parseFloat(amount), 
          category,
          user_id: user.id
        }
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('An error occurred while saving data!');
    } else {
      setTitle('');
      setAmount('');
      onExpenseAdded();
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h1 className="text-xl font-bold mb-6 text-center text-blue-600">Add New Expense</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Expense Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Rice & Curry, Bus Fare"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Amount (Rs.)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Food" className="text-gray-900 bg-white">Food</option>
            <option value="Transport" className="text-gray-900 bg-white">Transport</option>
            <option value="Bills" className="text-gray-900 bg-white">Bills</option>
            <option value="Entertainment" className="text-gray-900 bg-white">Entertainment</option>
            <option value="Other" className="text-gray-900 bg-white">Other</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
        >
          {loading ? 'Saving...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}