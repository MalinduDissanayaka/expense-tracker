import { supabase } from '@/lib/supabase';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

export default function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('ඔබට සැබවින්ම මෙම වියාදම මකා දැමීමට අවශ්‍යද?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      console.error('Error deleting:', error);
      alert('මකා දැමීමේදී දෝෂයක් සිදුවුණා!');
    } else {
      onExpenseDeleted(); // page.tsx එකට කියනවා ලිස්ට් එක refresh කරන්න කියලා
    }
  };

  return (
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
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-sm text-red-500">Rs. {exp.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400">{exp.date}</p>
                </div>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  title="මකා දමන්න"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}