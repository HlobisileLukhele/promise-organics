import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { calculateShipping } from '@/utils/shipping';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

const shortId = (id) => `#${id?.slice(0, 8).toUpperCase()}`;

const STATUS_STYLES = {
  paid:     'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  shipped:  'bg-blue-100 text-blue-700',
  cancelled:'bg-red-100 text-red-700',
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setOrder(data.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchOrder();
    else setLoading(false);
  }, [token, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a7c59]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-[#7a9e85]">
        Order not found.{' '}
        <Link to="/account/orders" className="text-[#7c8c7d] hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const subtotal = (order.order_items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        to="/account/orders"
        className="mb-6 text-[#7c8c7d] hover:underline flex items-center gap-2"
      >
        <FaArrowLeft /> Back to Orders
      </Link>

      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-medium text-gray-800 dark:text-[#f0f7f2]">
            Order {shortId(order.id)}
          </h1>
          <p className="text-sm text-gray-500 mt-1 dark:text-[#7a9e85]">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
          STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-[#1e3d2a] dark:border-[#2d5a3d]">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-[#f0f7f2]">Items</h2>
        <div className="space-y-4">
          {(order.order_items || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-[#2d5a3d] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#f7faf8] dark:bg-[#162d20] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={item.products?.image_url}
                    alt={item.products?.name || 'Product'}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                  />
                </div>
                <span className="text-gray-700 dark:text-[#c8dece]">
                  {item.products?.name || 'Product'} × {item.quantity}
                </span>
              </div>
              <span className="text-gray-800 font-medium dark:text-[#f0f7f2] whitespace-nowrap">
                R{(item.quantity * item.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-700 dark:border-[#2d5a3d] dark:text-[#c8dece]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            {shipping === 0
              ? <span className="text-[#4a7c59] dark:text-[#a8d4b5] font-semibold">FREE</span>
              : <span>R{shipping.toFixed(2)}</span>
            }
          </div>
          <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-3 text-base dark:text-[#f0f7f2] dark:border-[#2d5a3d]">
            <span>Total</span>
            <span>R{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
