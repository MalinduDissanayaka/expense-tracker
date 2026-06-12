'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Expense {
  id: number;
  amount: number;
  category: string;
  user_id: string;
}

export default function Analytics() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Colors for each category in the Pie Chart
  const COLORS = {
    Food: '#3B82F6',         // Blue
    Transport: '#10B981',    // Green
    Bills: '#EF4444',        // Red
    Entertainment: '#F59E0B',// Orange
    Other: '#6B7280',        // Gray
  };

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch all expenses for the current user
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        setExpenses(data);
      }
      setLoading(false);
    };

    checkUserAndFetchData();
  }, [router]);

  // Group expenses by category and calculate total for each
  const processChartData = () => {
    const categoryTotals: { [key: string]: number } = {
      Food: 0,
      Transport: 0,
      Bills: 0,
      Entertainment: 0,
      Other: 0,
    };

    expenses.forEach((exp) => {
      if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += Number(exp.amount);
      } else {
        categoryTotals['Other'] += Number(exp.amount);
      }
    });

    // Format data for Recharts components
    return Object.keys(categoryTotals)
      .map((key) => ({
        name: key,
        value: categoryTotals[key],
      }))
      .filter((item) => item.value > 0); // Only show categories that have expenses
  };

  const chartData = processChartData();
  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-gray-600">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Expense Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">Visual breakdown of your monthly spending</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center min-h-[350px]">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 self-start">Category Breakdown</h2>
          
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-500 my-auto">No data available to display chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rs. ${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Breakdown Summary List Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Summary</h2>
          
          <div className="flex flex-col gap-3 mt-2">
            {Object.keys(COLORS).map((cat) => {
              const amount = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0);
              const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;

              return (
                <div key={cat} className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[cat as keyof typeof COLORS] }}></span>
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">Rs. {amount.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}