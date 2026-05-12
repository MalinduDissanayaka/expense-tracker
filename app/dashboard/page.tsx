// src/app/dashboard/page.tsx
"use client"; // Interactive charts තියෙන නිසා මේක ඕනේ

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyData = [
  { name: 'Food', spent: 4500 },
  { name: 'Travel', spent: 2100 },
  { name: 'Bills', spent: 8000 },
  { name: 'Shopping', spent: 3500 },
];

export default function Dashboard() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Expense Analytics</h1>
        <p className="text-gray-500">Track where your money goes every month.</p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <p className="text-blue-600 text-sm font-semibold uppercase">Total Balance</p>
          <h2 className="text-4xl font-bold text-blue-900 mt-1">LKR 125,000</h2>
        </div>
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
          <p className="text-orange-600 text-sm font-semibold uppercase">Total Spent</p>
          <h2 className="text-4xl font-bold text-orange-900 mt-1">LKR 18,100</h2>
        </div>
      </div>

      {/* Visual Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px]">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Spending by Category</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: '#f8fafc'}} />
            <Bar dataKey="spent" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}