// src/app/login/page.tsx
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Manage your expenses easily</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-all">
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}