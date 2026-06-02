'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Budgets() {
  const [budgetLimit, setBudgetLimit] = useState<number>(0);
  const [inputLimit, setInputLimit] = useState<string>('');
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // 1. Fetch user's budget limit
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('limit_amount')
        .eq('user_id', user.id)
        .single();

      if (!budgetError && budgetData) {
        setBudgetLimit(Number(budgetData.limit_amount));
        setInputLimit(budgetData.limit_amount.toString());
      }

      // 2. Fetch user's current month expenses total
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id);

      if (!expenseError && expenseData) {
        const total = expenseData.reduce((sum, exp) => sum + Number(exp.amount), 0);
        setTotalSpent(total);
      }

      setLoading(false);
    };

    checkUserAndFetchData();
  }, [router]);

  // Handle Save or Update Budget Limit
  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLimit || isNaN(Number(inputLimit))) return alert('Please enter a valid amount!');

    setSaving(true);
    const amount = parseFloat(inputLimit);

    // Upsert logic: It will insert if not exists, or update if user_id matches
    const { error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: userId, limit_amount: amount },
        { onConflict: 'user_id' }
      );

    setSaving(false);

    if (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget limit.');
    } else {
      setBudgetLimit(amount);
      alert('Budget limit updated successfully!');
    }
  };

  // Calculate percentage used
  const percentageUsed = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
  const isOverBudget = totalSpent > budgetLimit;
  const isWarningZone = percentageUsed >= 80 && percentageUsed <= 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-gray-600">Loading Budget Manager...</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-xl mx-auto flex flex-col gap-6">
      {/* Title Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Monthly Budget Goal</h1>
        <p className="text-xs text-gray-400 mt-1">Set and monitor your monthly spending thresholds</p>
      </div>

      {/* Set Budget Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSaveBudget} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Set Monthly Budget Limit (Rs.)</label>
            <input
              type="number"
              value={inputLimit}
              onChange={(e) => setInputLimit(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 50000"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:bg-gray-400 transition-colors h-[42px]"
          >
            {saving ? 'Saving...' : 'Save Limit'}
          </button>
        </form>
      </div>

      {/* Progress & Insight Card */}
      {budgetLimit > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Budget Progress</h2>
          
          {/* Summary Text */}
          <div className="flex justify-between items-baseline mt-2">
            <div>
              <p className="text-2xl font-bold text-gray-800">Rs. {totalSpent.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total Spent Currently</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-600">Rs. {budgetLimit.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Budget Target Limit</p>
            </div>
          </div>

          {/* Progress Bar Dynamic Styling */}
          <div className="w-full bg-gray-100 rounded-full h-4 mt-2 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                isOverBudget 
                  ? 'bg-red-500' 
                  : isWarningZone 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>

          {/* Alert Messages based on Budget Condition */}
          <div className="flex justify-between text-xs font-medium mt-1">
            <span className={isOverBudget ? 'text-red-500' : isWarningZone ? 'text-amber-600' : 'text-emerald-600'}>
              {percentageUsed.toFixed(1)}% Used
            </span>
            <span>Rs. {Math.abs(budgetLimit - totalSpent).toFixed(2)} {isOverBudget ? 'Over Budget' : 'Remaining'}</span>
          </div>

          {/* Big Alert Banner */}
          {isOverBudget && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-md text-center">
              🚨 Warning: You have exceeded your monthly budget limit!
            </div>
          )}
          {isWarningZone && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold rounded-md text-center">
              ⚠️ Care: You have used over 80% of your allocated budget!
            </div>
          )}
        </div>
      )}
    </main>
  );
}