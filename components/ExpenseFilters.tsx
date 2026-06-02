'use client';

interface ExpenseFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export default function ExpenseFilters({
  selectedCategory,
  setSelectedCategory,
  selectedMonth,
  setSelectedMonth,
}: ExpenseFiltersProps) {
  
  const months = [
    { value: 'All', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md flex gap-4 border border-gray-200">
      
      {/* Category Filter */}
      <div className="flex-1">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          Category Filter
        </label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All" className="bg-white text-gray-900 font-medium">All Categories</option>
            <option value="Food" className="bg-white text-gray-900 font-medium">Food</option>
            <option value="Transport" className="bg-white text-gray-900 font-medium">Transport</option>
            <option value="Bills" className="bg-white text-gray-900 font-medium">Bills</option>
            <option value="Entertainment" className="bg-white text-gray-900 font-medium">Entertainment</option>
            <option value="Other" className="bg-white text-gray-900 font-medium">Other</option>
          </select>
        </div>
      </div>

      {/* Month Filter */}
      <div className="flex-1">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          Month Filter
        </label>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value} className="bg-white text-gray-900 font-medium">
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}