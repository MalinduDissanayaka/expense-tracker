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

    // 1. Get the currently logged-in user details from Supabase Session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('User session not found. Please log in again.');
      setLoading(false);
      return;
    }

    // 2. Insert the expense into the database along with the user's unique ID
    const { error } = await supabase
      .from('expenses')
      .insert([
        { 
          title, 
          amount: parseFloat(amount), 
          category,
          user_id: user.id // Linking the expense to the authenticated user
        }
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('An error occurred while saving data!');
    } else {
      setTitle('');
      setAmount('');
      onExpenseAdded(); // Notify parent component to refresh the list
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center text-blue-600">Add New Expense</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expense Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Rice & Curry, Bus Fare"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount (Rs.)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
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
  );
}