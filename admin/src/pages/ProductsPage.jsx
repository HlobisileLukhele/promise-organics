import { useEffect, useState } from 'react';
import {
  fetchProducts, createProduct, updateProduct,
  updateStock, deleteProduct,
} from '../api/adminApi';

const empty = { name: '', description: '', price: '', stock: '', category: '', sku: '', image_url: '', in_stock: true };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');
  const [toast, setToast]       = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await fetchProducts();
      setProducts(data.products);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setForm(empty); setModal('create'); }

  function openEdit(p) {
    setForm({
      name:        p.name        || '',
      description: p.description || '',
      price:       p.price       ?? '',
      stock:       p.stock       ?? '',
      category:    p.category    || '',
      sku:         p.sku         || '',
      image_url:   p.image_url   || '',
      in_stock:    p.in_stock    ?? true,
    });
    setModal(p);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create') {
        const { data } = await createProduct(form);
        setProducts((prev) => [data.product, ...prev]);
      } else {
        const { data } = await updateProduct(modal.id, form);
        setProducts((prev) => prev.map((p) => p.id === modal.id ? data.product : p));
      }
      setModal(null);
    } catch {
      alert('Failed to save product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product.');
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function toggleStock(p) {
    const newVal = !p.in_stock;
    try {
      await updateStock(p.id, { in_stock: newVal });
      setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, in_stock: newVal } : x));
      showToast(newVal ? 'Product marked as In Stock 🟢' : 'Product marked as Out of Stock 🔴');
    } catch {
      alert('Failed to update stock status.');
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-gray-400 dark:text-[#7a9e85] p-8">Loading products…</div>;
  if (error)   return <div className="text-red-600 p-8">{error}</div>;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-7 right-7 z-[2000] bg-[#2d5a3d] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-3xl mb-1">Products</h1>
          <p className="text-gray-400 dark:text-[#7a9e85] text-sm">{products.length} products in your store</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-lg hover:bg-[#2d5a3d] transition-colors duration-200 font-medium text-sm cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      <div className="mb-5">
        <input
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80 border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-4 py-2.5 text-sm bg-gray-50 dark:bg-[#1e3d2a] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
        />
      </div>

      <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-[#162d20] text-gray-500 dark:text-[#7a9e85] uppercase text-xs">
            <tr>
              {['Product', 'Category', 'SKU', 'Price', 'Stock', 'Availability', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400 dark:text-[#7a9e85]">
                  No products found.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 dark:border-[#2d5a3d] hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-11 h-11 object-cover rounded-lg border border-gray-200 dark:border-[#2d5a3d]" />
                      : <div className="w-11 h-11 bg-gray-100 dark:bg-[#162d20] rounded-lg border border-gray-200 dark:border-[#2d5a3d] flex items-center justify-center text-lg">🌿</div>
                    }
                    <div>
                      <div className="font-medium text-[#2d5a3d] dark:text-[#7dc49a]">{p.name}</div>
                      {p.description && (
                        <div className="text-xs text-gray-400 dark:text-[#7a9e85] mt-0.5 max-w-[200px] truncate">{p.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {p.category
                    ? <span className="bg-[#e8f0eb] dark:bg-[#2d5a3d]/30 text-[#4a7c59] dark:text-[#7dc49a] px-2.5 py-0.5 rounded-full text-xs font-medium">{p.category}</span>
                    : <span className="text-gray-400 dark:text-[#7a9e85]">—</span>
                  }
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400 dark:text-[#7a9e85]">{p.sku || '—'}</td>
                <td className="px-5 py-3.5 font-semibold text-[#2d5a3d] dark:text-[#7dc49a]">R{parseFloat(p.price).toFixed(2)}</td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-[#7a9e85]">{p.stock ?? 0}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleStock(p)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer border-none
                      ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {p.in_stock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="bg-[#e8f0eb] text-[#4a7c59] rounded-md px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-[#d0e4d6] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-50 text-red-600 rounded-md px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="bg-white dark:bg-[#1e3d2a] rounded-2xl p-8 w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl dark:text-[#f0f7f2]">{modal === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
              <button
                onClick={() => setModal(null)}
                className="bg-transparent border-none text-xl cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Product Name *">
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2]"
                  />
                </Field>
                <Field label="Category">
                  <input
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Hair Care"
                    className="w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85]"
                  />
                </Field>
                <Field label="Price (R) *">
                  <input
                    type="number" min="0" step="0.01"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2]"
                  />
                </Field>
                <Field label="Stock Quantity">
                  <input
                    type="number" min="0"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2]"
                  />
                </Field>
                <Field label="SKU">
                  <input
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. PO-001"
                    className="w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85]"
                  />
                </Field>
                <Field label="Image URL">
                  <input
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://…"
                    className="w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85]"
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-[#2d5a3d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent bg-gray-50 dark:bg-[#162d20] dark:text-[#f0f7f2] resize-y"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={e => setForm({ ...form, in_stock: e.target.checked })}
                  className="w-4 h-4 accent-[#4a7c59]"
                />
                <span className="text-gray-600 dark:text-[#c8dece]">Mark as In Stock</span>
              </label>

              <div className="flex gap-2.5 mt-7 justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="border border-gray-300 dark:border-[#2d5a3d] text-gray-600 dark:text-[#c8dece] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#162d20] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d5a3d] transition-colors duration-200 cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Saving…' : modal === 'create' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold tracking-wider uppercase text-gray-400 dark:text-[#7a9e85] mb-1.5">{label}</span>
      {children}
    </label>
  );
}
