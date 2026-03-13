import { useEffect, useState } from 'react';
import { fetchStats } from '../api/adminApi';

function StatCard({ label, value, sub, accentClass }) {
  return (
    <div className={`bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] p-6 flex flex-col gap-1.5 border-t-[3px] ${accentClass}`}>
      <div className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-[#7a9e85]">{label}</div>
      <div
        className="text-4xl font-bold text-[#2d5a3d] leading-none"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-gray-400 dark:text-[#7a9e85]">{sub}</div>}
    </div>
  );
}

const statusMeta = {
  pending:    { color: '#c8932b', barClass: 'bg-amber-500',   label: 'Pending'    },
  processing: { color: '#4a7098', barClass: 'bg-blue-500',    label: 'Processing' },
  shipped:    { color: '#7c5cbf', barClass: 'bg-purple-500',  label: 'Shipped'    },
  delivered:  { color: '#4a7c59', barClass: 'bg-[#4a7c59]',   label: 'Delivered'  },
  cancelled:  { color: '#c0392b', barClass: 'bg-red-500',     label: 'Cancelled'  },
};

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetchStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 dark:text-[#7a9e85] p-8">Loading dashboard…</div>;
  if (error)   return <div className="text-red-600 p-8">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-1">Dashboard</h1>
        <p className="text-gray-400 dark:text-[#7a9e85] text-sm">
          {new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
        <StatCard label="Total Orders"    value={stats.total_orders}    accentClass="border-t-[#4a7c59]" />
        <StatCard label="Total Revenue"   value={`R${stats.total_revenue.toLocaleString()}`} accentClass="border-t-amber-400" />
        <StatCard label="Customers"       value={stats.total_customers} accentClass="border-t-orange-400" />
        <StatCard label="Products"        value={stats.total_products}  accentClass="border-t-[#8B9D83]" />
        <StatCard label="Pending Reviews" value={stats.pending_reviews} sub="Awaiting approval" accentClass="border-t-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] p-6">
          <h2 className="text-xl mb-5 dark:text-[#f0f7f2]">Orders by Status</h2>
          {Object.keys(stats.orders_by_status).length === 0
            ? <p className="text-gray-400 dark:text-[#7a9e85] text-sm">No orders yet.</p>
            : Object.entries(stats.orders_by_status).map(([status, count]) => {
                const m = statusMeta[status] || { color: '#5a5a5a', barClass: 'bg-gray-400', label: status };
                const total = Object.values(stats.orders_by_status).reduce((a, b) => a + b, 0);
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={status} className="mb-3.5">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-600 dark:text-[#c8dece] capitalize">{m.label}</span>
                      <span className="text-sm font-semibold" style={{ color: m.color }}>{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-[#162d20] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${m.barClass}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* Low stock */}
        <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] p-6">
          <h2 className="text-xl mb-5 dark:text-[#f0f7f2]">Low Stock Alert</h2>
          {stats.low_stock_products.length === 0
            ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">✓</div>
                <p className="text-[#4a7c59] text-sm font-medium">All products are well stocked</p>
              </div>
            )
            : stats.low_stock_products.map((p) => (
              <div key={p.id} className="flex justify-between items-center py-2.5 border-b border-gray-200 dark:border-[#2d5a3d]">
                <span className="text-sm text-gray-800 dark:text-[#f0f7f2]">{p.name}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                  ${p.stock === 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
                  }`}>
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
