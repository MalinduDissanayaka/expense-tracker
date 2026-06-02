interface TotalExpenseCardProps {
  expenses: { amount: number }[];
}

export default function TotalExpenseCard({ expenses }: TotalExpenseCardProps) {
  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="w-full max-w-md p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md text-white text-center">
      <p className="text-sm uppercase tracking-wider opacity-80 font-medium">Total Expenses</p>
      <h2 className="text-3xl font-extrabold mt-2">
        Rs. {totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h2>
    </div>
  );
}