import { useEffect, useState } from 'react';
import { fetchOrders, fetchOrderById, editOrder, deleteOrder } from '../api/adminApi';
import { generateDispatchSlip } from '../utils/generateDispatchSlip';

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

const FREE_SHIPPING_THRESHOLD = 580;

function formatDispatchAddress(shippingAddress, billingInfo) {
  if (shippingAddress) {
    if (typeof shippingAddress === 'object') {
      const parts = [
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.province,
        shippingAddress.postal_code,
      ].filter(Boolean);
      if (parts.length) return parts.join(', ');
    }
    if (typeof shippingAddress === 'string' && shippingAddress.trim()) {
      return shippingAddress.trim();
    }
  }
  if (billingInfo) {
    const parts = [
      billingInfo.address,
      billingInfo.city,
      billingInfo.province,
      billingInfo.postal_code,
    ].filter(Boolean);
    if (parts.length) return parts.join(', ');
  }
  return '—';
}

function EditOrderModal({ order, onClose, onSave }) {
  const [status,          setStatus]          = useState(order.status);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes,           setNotes]           = useState('');
  const [saving,          setSaving]          = useState(false);
  const [detail,          setDetail]          = useState(null);
  const [loadingDetail,   setLoadingDetail]   = useState(true);
  const [copied,          setCopied]          = useState(false);

  useEffect(() => {
    fetchOrderById(order.id)
      .then(({ data }) => {
        const o = data.order;
        setDetail(o);
        const existingAddr = typeof o.shipping_address === 'string' ? o.shipping_address : '';
        setShippingAddress(existingAddr);
        setNotes(o.notes || '');
      })
      .catch(() => {})
      .finally(() => setLoadingDetail(false));
  }, [order.id]);

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

  const displayAddress = detail
    ? formatDispatchAddress(detail.shipping_address, detail.billing_info)
    : '—';

  const handleCopyAddress = () => {
    if (displayAddress === '—') return;
    navigator.clipboard.writeText(displayAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const subtotal = (detail?.order_items || []).reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;

  const inputCls = 'w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] focus:outline-none focus:ring-2 focus:ring-[#4a7c59]';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#2d5a3d] flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#f0f7f2]">
            Edit Order{' '}
            <span className="font-mono text-sm text-gray-400 dark:text-[#7a9e85]">
              #{order.id.slice(0, 8)}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-[#c8dece] text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {loadingDetail ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#4a7c59]" />
            </div>
          ) : (
            <>
              {/* ── Dispatch Details (read-only) ─────────────────────── */}
              <div className="bg-[#f7faf8] dark:bg-[#162d20] rounded-lg border border-gray-200 dark:border-[#2d5a3d] overflow-hidden">
                <div className="px-4 py-2.5 bg-[#eaf2ec] dark:bg-[#1a3326] border-b border-gray-200 dark:border-[#2d5a3d] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2d5a3d] dark:text-[#7a9e85] uppercase tracking-wider">
                    Dispatch Details
                  </span>
                  <button
                    type="button"
                    onClick={() => generateDispatchSlip({ detail, displayAddress, notes })}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#4a7c59] hover:bg-[#2d5a3d] text-white rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Dispatch Slip
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Customer */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 dark:text-[#7a9e85] uppercase tracking-wide mb-1.5">Customer</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-[#f0f7f2]">
                      {detail?.users?.full_name || '—'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#7a9e85] mt-0.5">
                      {detail?.users?.email || '—'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#7a9e85] mt-0.5">
                      {detail?.billing_info?.phone || '—'}
                    </p>
                  </div>

                  {/* Shipping address */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-gray-400 dark:text-[#7a9e85] uppercase tracking-wide">
                        Shipping Address
                      </p>
                      <button
                        onClick={handleCopyAddress}
                        className="flex items-center gap-1 text-xs text-[#4a7c59] hover:text-[#2d5a3d] dark:text-[#7a9e85] dark:hover:text-[#c8dece] transition-colors"
                      >
                        {copied
                          ? <><span>✓</span> Copied!</>
                          : <><span>📋</span> Copy Address</>
                        }
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-[#c8dece] leading-relaxed">
                      {displayAddress}
                    </p>
                  </div>

                  {/* Items ordered */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 dark:text-[#7a9e85] uppercase tracking-wide mb-2">
                      Items Ordered
                    </p>
                    <div className="space-y-1.5">
                      {(detail?.order_items || []).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-[#c8dece]">
                            {item.products?.name || 'Unknown product'} × {item.quantity}
                          </span>
                          <span className="text-gray-400 dark:text-[#7a9e85] text-xs tabular-nums">
                            R{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order totals */}
                  <div className="border-t border-gray-200 dark:border-[#2d5a3d] pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-[#7a9e85]">
                      <span>Subtotal</span>
                      <span className="tabular-nums">R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-[#7a9e85]">
                      <span>Shipping</span>
                      {shipping === 0
                        ? <span className="text-[#4a7c59] dark:text-[#6ab584] font-semibold">FREE</span>
                        : <span className="tabular-nums">R{shipping.toFixed(2)}</span>
                      }
                    </div>
                    <div className="flex justify-between font-semibold text-gray-800 dark:text-[#f0f7f2]">
                      <span>Order Total</span>
                      <span className="tabular-nums">R{parseFloat(detail?.total_amount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Editable fields ──────────────────────────────────── */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-[#c8dece] block mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-[#c8dece] block mb-1">
                    Shipping Address Override
                    <span className="text-xs text-gray-400 dark:text-[#7a9e85] font-normal ml-1.5">
                      (leave blank to use address above)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    placeholder="Override shipping address…"
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2d5a3d] flex gap-3 justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-[#c8dece] border border-gray-300 dark:border-[#2d5a3d] rounded-lg hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loadingDetail}
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
                    {o.customer_phone && o.customer_phone !== '—' && (
                      <div className="text-xs text-gray-400 dark:text-[#7a9e85]">{o.customer_phone}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-0.5">
                      {(o.order_items || []).map((item, i) => (
                        <div key={i} className="text-xs text-gray-600 dark:text-[#c8dece]">
                          {item.name} × {item.quantity}
                        </div>
                      ))}
                      {(!o.order_items || o.order_items.length === 0) && (
                        <span className="text-xs text-gray-400 dark:text-[#7a9e85]">—</span>
                      )}
                    </div>
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
