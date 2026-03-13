import { FaBoxOpen } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

const API = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
  const user  = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.success) setOrders(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const shortId = (id) => `#${id?.slice(0, 8).toUpperCase()}`;

  const filteredOrders = orders.filter((o) =>
    shortId(o.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Welcome heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#f0f7f2]">
          Welcome back, <span className="text-[#7c8c7d]">{firstName}</span> 👋
        </h2>
        <p className="text-gray-500 dark:text-[#7a9e85] text-sm mt-1">Here's a summary of your recent orders.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xl font-medium text-gray-800 dark:text-[#f0f7f2]">
          <FaBoxOpen className="text-[#7c8c7d] size-8" />
          <span>Recent Orders</span>
        </div>
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border border-gray-300 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] text-sm rounded-sm px-3 py-2 w-full md:w-64 outline-none focus-within:border-[#7c8c7d]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-400 dark:text-[#7a9e85] text-sm py-6 text-center">Loading orders…</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#162d20] text-left text-gray-600 dark:text-[#7a9e85] whitespace-nowrap">
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-[#162d20] border-gray-200 dark:border-[#2d5a3d] transition whitespace-nowrap">
                  <td className="p-3 font-medium text-gray-800 dark:text-[#f0f7f2]">{shortId(order.id)}</td>
                  <td className="p-3 text-gray-700 dark:text-[#c8dece]">{new Date(order.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === 'paid'      ? 'bg-green-100 text-green-700' :
                      order.status === 'pending'   ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'shipped'   ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-800 dark:text-[#c8dece]">R{parseFloat(order.total_amount).toFixed(2)}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 dark:text-[#7a9e85] py-10">
                    {orders.length === 0 ? "You haven't placed any orders yet." : "No orders match that ID."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
