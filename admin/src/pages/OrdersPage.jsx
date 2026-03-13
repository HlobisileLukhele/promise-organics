import { useEffect, useState } from 'react';
import { fetchOrders, editOrder, deleteOrder } from '../api/adminApi';

const ALL_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const statusMeta = {
  pending:    { cls: 'bg-orange-100 text-orange-700' },
  paid:       { cls: 'bg-teal-100 text-teal-700'    },
  processing: { cls: 'bg-blue-100 text-blue-700'    },
  shipped:    { cls: 'bg-purple-100 text-purple-700' },
  delivered:  { cls: 'bg-green-100 text-green-700'  },
  cancelled:  { cls: 'bg-red-100 text-red-700'      },
  refunded:   { cls: 'bg-gray-100 text-gray-600'    },
};

const MONTHS = [
  'All',
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

function EditOrderModal({ order, onClose, onSave }) {
  const [status,          setStatus]          = useState(order.status);
  const [shippingAddress, setShippingAddress] = useState(order.shipping_address || '');
  const [notes,           setNotes]           = useState(order.notes || '');
  const [saving,          setSaving]          = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(order.id, { status, shipping_address: shippingAddress, notes });
      onClose();
    } catch {
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] focus:outline-none focus:ring-2 focus:ring-[#4a7c59]';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-[#f0f7f2] mb-5">
          Edit Order{' '}
          <span className="font-mono text-sm text-gray-400 dark:text-[#7a9e85]">
            #{order.id.slice(0, 8)}
          </span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-[#c8dece] block mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
              {ALL_STATUSES.map(s => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-[#c8dece] block mb-1">
              Shipping Address
            </label>
            <input
              type="text"
              value={shippingAddress}
              onChange={e => setShippingAddress(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-[#c8dece] block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-[#c8dece] border border-gray-300 dark:border-[#2d5a3d] rounded-lg hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-[#4a7c59] text-white rounded-lg hover:bg-[#2d5a3d] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders,            setOrders]            = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState('');
  const [search,            setSearch]            = useState('');
  const [selectedMonth,     setSelectedMonth]     = useState('All');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [editingOrder,      setEditingOrder]      = useState(null);
  const [deletingOrder,     setDeletingOrder]     = useState(null);
  const [deleting,          setDeleting]          = useState(false);

  useEffect(() => {
    fetchOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#month-dropdown-wrapper')) {
        setShowMonthDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());

    if (selectedMonth === 'All') return matchesSearch;

    const orderMonthName = new Date(o.created_at).toLocaleString('default', { month: 'long' });
    return matchesSearch && orderMonthName === selectedMonth;
  });

  async function handleEditSave(id, payload) {
    await editOrder(id, payload);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...payload } : o));
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      setDeletingOrder(null);
    } catch {
      alert('Failed to delete order.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="text-gray-400 dark:text-[#7a9e85] p-8">Loading orders…</div>;
  if (error)   return <div className="text-red-600 p-8">{error}</div>;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl mb-1">Orders</h1>
        <p className="text-gray-400 dark:text-[#7a9e85] text-sm">{orders.length} total orders</p>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          placeholder="Search by customer name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80 border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-4 py-2.5 text-sm bg-gray-50 dark:bg-[#1e3d2a] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-[#7a9e85] mb-4">
        Showing {filteredOrders.length} orders{selectedMonth !== 'All' ? ` for ${selectedMonth}` : ' total'}
      </p>

      <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-[#162d20] text-gray-500 dark:text-[#7a9e85] uppercase text-xs">
            <tr>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">
                <div id="month-dropdown-wrapper" className="relative inline-block">
                  <button
                    onClick={() => setShowMonthDropdown(prev => !prev)}
                    className="flex items-center gap-1 hover:text-[#2d5a3d] transition-colors"
                  >
                    DATE
                    {selectedMonth !== 'All' && (
                      <span className="ml-1 text-[10px] bg-[#4a7c59] text-white px-1.5 py-0.5 rounded-full normal-case font-normal">
                        {selectedMonth}
                      </span>
                    )}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMonthDropdown && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-[#1e3d2a] border border-gray-200 dark:border-[#2d5a3d] rounded-lg shadow-xl min-w-[150px] max-h-[280px] overflow-y-auto">
                      {MONTHS.map(month => (
                        <button
                          key={month}
                          onClick={() => { setSelectedMonth(month); setShowMonthDropdown(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f7faf8] dark:hover:bg-[#162d20] transition-colors ${
                            selectedMonth === month
                              ? 'text-[#4a7c59] font-semibold bg-[#f0f7f2] dark:bg-[#162d20]'
                              : 'text-gray-700 dark:text-[#c8dece]'
                          }`}
                        >
                          {month === 'All' ? '📋 All Orders' : month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400 dark:text-[#7a9e85]">
                  No orders found.
                </td>
              </tr>
            )}
            {filteredOrders.map(o => {
              const m = statusMeta[o.status] || { cls: 'bg-gray-100 text-gray-600' };
              return (
                <tr
                  key={o.id}
                  className="border-t border-gray-100 dark:border-[#2d5a3d] hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-400 dark:text-[#7a9e85] bg-gray-100 dark:bg-[#162d20] px-2 py-0.5 rounded">
                      #{o.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-800 dark:text-[#f0f7f2]">{o.customer_name}</div>
                    <div className="text-xs text-gray-400 dark:text-[#7a9e85]">{o.customer_email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-[#7a9e85]">
                    {o.item_count} item{o.item_count !== 1 ? 's' : ''}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#2d5a3d]">
                    R{parseFloat(o.total_amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 dark:text-[#7a9e85]">
                    {new Date(o.created_at).toLocaleDateString('en-ZA', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${m.cls}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingOrder(o)}
                        className="px-3 py-1 text-xs bg-[#4a7c59] text-white rounded-lg hover:bg-[#2d5a3d] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingOrder(o)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation */}
      {deletingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#f0f7f2] mb-3">Delete Order</h2>
            <p className="text-sm text-gray-500 dark:text-[#7a9e85] mb-6">
              Are you sure you want to delete order{' '}
              <span className="font-mono font-bold">#{deletingOrder.id.slice(0, 8)}</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-[#c8dece] border border-gray-300 dark:border-[#2d5a3d] rounded-lg hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingOrder.id)}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
