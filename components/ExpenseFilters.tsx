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
  
  // මාස ටික ලිස්ට් එකක් විදියට ගමු (HTML select එකට දාන්න)
  const months = [
    { value: 'All', label: 'සියලුම මාස (All Months)' },
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
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md flex gap-4">
      {/* Category Filter */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Category Filter
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md bg-gray-50 text-sm font-medium"
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Month Filter */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Month Filter
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full p-2 border rounded-md bg-gray-50 text-sm font-medium"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}