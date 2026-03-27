import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/adminApi';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await adminLogin(email, password);
      if (!data.user?.is_admin) {
        setError('Access denied. Admin accounts only.');
        return;
      }
      localStorage.setItem('admin_token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="flex-1 bg-[#4a7c59] flex flex-col items-center justify-center p-12 min-w-0">
        <div className="text-center max-w-sm">
          <div
            className="text-5xl font-bold text-white leading-tight mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Promise<br />
            <span className="text-amber-200 italic">Organics</span>
          </div>
          <div className="text-xs text-white/45 tracking-[0.15em] uppercase mb-10">
            Admin Dashboard
          </div>
          <div className="w-12 h-0.5 bg-amber-200 mx-auto mb-8" />
          <p className="text-white/50 text-sm leading-relaxed">
            Manage your store, products, orders and customer reviews from one place.
          </p>
        </div>
      </div>

      {/* Right login form */}
      <div className="w-[480px] flex-shrink-0 flex items-center justify-center px-10 py-12 bg-white">
        <div className="w-full max-w-sm">
          <h1
            className="text-3xl text-[#2d5a3d] mb-1.5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm mb-9">Sign in to manage your store</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@promiseorganics.co.za"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent transition-colors"
              />
            </div>

            <div className="mb-8">
              <label className="block text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 pr-10 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white rounded-lg text-sm font-semibold tracking-wide transition-colors duration-200
                ${loading ? 'bg-[#8B9D83] cursor-not-allowed' : 'bg-[#4a7c59] hover:bg-[#2d5a3d] cursor-pointer'}`}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-8">
            Promise Organics © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
