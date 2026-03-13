import { useEffect, useState } from 'react';
import { fetchReviews, approveReview, rejectReview, deleteReview } from '../api/adminApi';

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={`text-base ${i <= rating ? 'text-amber-400' : 'text-gray-200 dark:text-[#2d5a3d]'}`}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('pending');

  useEffect(() => {
    fetchReviews()
      .then(({ data }) => setReviews(data.reviews))
      .catch(() => setError('Failed to load reviews.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(id) {
    try {
      await approveReview(id);
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_approved: true } : r));
    } catch { alert('Failed to approve.'); }
  }

  async function handleReject(id) {
    try {
      await rejectReview(id);
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_approved: false } : r));
    } catch { alert('Failed to reject.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Permanently delete this review?')) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch { alert('Failed to delete.'); }
  }

  const pendingCount  = reviews.filter(r => !r.is_approved).length;
  const approvedCount = reviews.filter(r =>  r.is_approved).length;

  const filtered = reviews.filter((r) => {
    if (filter === 'pending')  return !r.is_approved;
    if (filter === 'approved') return  r.is_approved;
    return true;
  });

  if (loading) return <div className="text-gray-400 dark:text-[#7a9e85] p-8">Loading reviews…</div>;
  if (error)   return <div className="text-red-600 p-8">{error}</div>;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl mb-1">Reviews</h1>
        <p className="text-gray-400 dark:text-[#7a9e85] text-sm">{reviews.length} total reviews</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'pending',  label: 'Pending',  count: pendingCount  },
          { key: 'approved', label: 'Approved', count: approvedCount },
          { key: 'all',      label: 'All',      count: reviews.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors
              ${filter === key
                ? 'bg-[#4a7c59] text-white border-none'
                : 'bg-white dark:bg-[#1e3d2a] text-gray-600 dark:text-[#c8dece] border border-gray-200 dark:border-[#2d5a3d] hover:bg-gray-50 dark:hover:bg-[#162d20]'
              }`}
          >
            {label}
            <span className={`rounded-lg px-1.5 py-0.5 text-xs font-semibold
              ${filter === key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-[#162d20] text-gray-400 dark:text-[#7a9e85]'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] p-12 text-center">
          <div className="text-4xl mb-2">★</div>
          <p className="text-gray-400 dark:text-[#7a9e85] text-sm">No {filter !== 'all' ? filter : ''} reviews found.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className={`bg-white dark:bg-[#1e3d2a] rounded-xl border border-gray-200 dark:border-[#2d5a3d] border-l-4 p-5 flex gap-5 items-start
              ${r.is_approved ? 'border-l-[#4a7c59]' : 'border-l-amber-400'}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-base font-bold text-[#4a7c59]
              ${r.is_approved ? 'bg-[#e8f0eb] dark:bg-[#2d5a3d]/40' : 'bg-gray-100 dark:bg-[#162d20]'}`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {r.name?.charAt(0).toUpperCase() || '?'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <span className="font-semibold text-sm text-[#2d5a3d]">{r.name}</span>
                <Stars rating={r.rating} />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${r.is_approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {r.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              {r.title && <div className="text-sm font-medium text-gray-800 dark:text-[#f0f7f2] mb-1">{r.title}</div>}
              <p className="text-sm text-gray-600 dark:text-[#7a9e85] leading-relaxed m-0">{r.message}</p>
              <div className="text-xs text-gray-400 dark:text-[#7a9e85] mt-2">
                {new Date(r.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {!r.is_approved && (
                <button
                  onClick={() => handleApprove(r.id)}
                  className="bg-green-100 text-green-700 border-none rounded-md px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-green-200 transition-colors"
                >
                  Approve
                </button>
              )}
              {r.is_approved && (
                <button
                  onClick={() => handleReject(r.id)}
                  className="bg-orange-100 text-orange-700 border-none rounded-md px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-orange-200 transition-colors"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => handleDelete(r.id)}
                className="bg-red-50 text-red-600 border-none rounded-md px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
