import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    if (!title || !amount) return alert('කරුණාකර සියලුම විස්තර පුරවන්න!');

    setLoading(true);
    const { error } = await supabase
      .from('expenses')
      .insert([{ title, amount: parseFloat(amount), category }]);
    setLoading(false);

    if (error) {
      console.error(error);
      alert('දත්ත ඇතුළත් කිරීමේදී දෝෂයක් සිදුවුණා!');
    } else {
      setTitle('');
      setAmount('');
      onExpenseAdded(); // page.tsx එකට කියනවා ලිස්ට් එක refresh කරන්න කියලා
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center text-blue-600">Add New Expense</h1>
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
  );
}