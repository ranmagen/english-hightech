import { useState } from 'react';
import { Lock } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'techspace2025';
    if (password === adminPassword) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-6 mx-auto">
          <Lock size={28} className="text-sky-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">Admin Panel</h1>
        <p className="text-slate-500 text-sm text-center mb-6">TechSpace — Teacher Access</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${
              error ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-sky-500'
            }`}
            autoFocus
          />
          {error && <p className="text-red-500 text-xs text-center">Incorrect password. Try again.</p>}
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
