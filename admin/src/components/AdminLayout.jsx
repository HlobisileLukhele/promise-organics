import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './common/ThemeToggle';

const links = [
  { to: '/',         label: 'Dashboard', icon: '▦' },
  { to: '/orders',   label: 'Orders',    icon: '📦' },
  { to: '/products', label: 'Products',  icon: '🌿' },
  { to: '/reviews',  label: 'Reviews',   icon: '★'  },
  { to: '/blog',     label: 'Blog Posts', icon: '📝' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('admin_token');
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1f17]">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-[#4a7c59] flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <div className="font-bold text-white text-xl leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Promise<br />
            <span className="text-amber-200 italic">Organics</span>
          </div>
          <div className="mt-1.5 text-[11px] tracking-widest uppercase text-green-200/70">
            Admin Portal
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 mb-1 rounded-lg text-sm transition-all duration-150 no-underline
                ${isActive
                  ? 'bg-white/10 text-white font-semibold border-l-[3px] border-amber-200'
                  : 'text-white/60 hover:bg-white/10 hover:text-white border-l-[3px] border-transparent'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-5 pb-7 pt-4">
          <div className="text-[11px] text-white/30 tracking-widest uppercase mb-2.5">
            promiseorganics@gmail.com
          </div>
          <button
            onClick={logout}
            className="w-full px-3.5 py-2 bg-amber-800/20 text-amber-300 border border-amber-700/30 rounded-lg text-sm font-medium hover:bg-amber-800/30 transition-colors duration-150 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 bg-gray-50 dark:bg-[#0f1f17] overflow-y-auto min-h-screen">
        {/* Top bar */}
        <div className="bg-white dark:bg-[#1e3d2a] border-b border-gray-200 dark:border-[#2d5a3d] px-8 py-3.5 flex items-center justify-end gap-2.5">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          <span className="text-xs text-gray-400 dark:text-[#7a9e85]">All systems operational</span>
          <ThemeToggle />
        </div>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
