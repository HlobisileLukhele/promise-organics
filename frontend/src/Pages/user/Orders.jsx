import { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaShippingFast } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

const formatCurrency = (amount) => `R${Number(amount).toFixed(2)}`;

const shortId = (id) => `#${id?.slice(0, 8).toUpperCase()}`;

const getItemsSummary = (orderItems) => {
  if (!orderItems || orderItems.length === 0) return 'No items';
  const firstName = orderItems[0]?.products?.name || 'Product';
  if (orderItems.length === 1) return firstName;
  return `${firstName} +${orderItems.length - 1} more`;
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setOrders(data.data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
    else setLoading(false);
  }, [token]);

  const filteredOrders = orders.filter((o) =>
    shortId(o.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a7c59]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-2xl font-medium text-gray-800 dark:text-[#f0f7f2]">
          <FaShippingFast className="text-[#7c8c7d] size-10" />
          <span>Your Orders</span>
        </div>
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] dark:focus:border-[#4a7c59]"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-gray-700 dark:text-[#c8dece]">
          <thead className="bg-gray-100 text-left text-gray-600 whitespace-nowrap dark:bg-[#162d20] dark:text-[#7a9e85]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition border-b border-gray-200 whitespace-nowrap dark:hover:bg-[#162d20] dark:border-[#2d5a3d]">
                  <td className="p-3 font-medium text-gray-800 dark:text-[#f0f7f2]">{shortId(order.id)}</td>
                  <td className="p-3 text-gray-700 dark:text-[#c8dece]">{formatDate(order.created_at)}</td>
                  <td className="p-3 text-gray-700 dark:text-[#c8dece]">{getItemsSummary(order.order_items)}</td>
                  <td className="p-3 text-gray-800 dark:text-[#f0f7f2]">{formatCurrency(order.total_amount)}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === 'paid'    ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="flex items-center gap-1 text-[#7c8c7d] hover:underline text-sm"
                    >
                      <FaEye />
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400 dark:text-[#7a9e85]">
                  {orders.length === 0 ? "You haven't placed any orders yet." : "No orders match that ID."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
