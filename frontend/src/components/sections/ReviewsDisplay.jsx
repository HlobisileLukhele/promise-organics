import { useState, useEffect, useRef } from 'react';
import { GoStarFill } from 'react-icons/go';
import { FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= rating
          ? <GoStarFill key={s} className="text-[#7c8c7d] text-sm" />
          : <FiStar     key={s} className="text-gray-300 text-sm" />
      )}
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ReviewCard({ review }) {
  const [applauded, setApplauded] = useState(false);
  const [count,     setCount]     = useState(review.helpful_count || 0);
  const [lightbox,  setLightbox]  = useState(null);

  const handleApplaud = async () => {
    if (applauded) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to applaud a review');
      return;
    }
    try {
      const res  = await fetch(`${API}/api/reviews/${review.id}/helpful`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setApplauded(true);
        setCount(data.helpful_count);
      }
    } catch {
      // silent fail
    }
  };

  return (
    <>
      <div className="bg-[#f0f4f0] dark:bg-[#1e3d2a] border border-[#7c8c7d]/15 dark:border-[#2d5a3d] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3 h-full">
        <StarRow rating={review.rating} />

        <h3 className="font-semibold text-[#3d4f3e] dark:text-[#f0f7f2] text-base leading-snug">
          {review.title}
        </h3>

        <p className="text-gray-600 dark:text-[#c8dece] text-sm leading-relaxed line-clamp-3 flex-1">
          {review.message}
        </p>

        {/* Review images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mt-1">
            {review.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                onClick={() => setLightbox(src)}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-[#2d5a3d] cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#7c8c7d]/15 mt-auto">
          <div>
            <span className="text-sm font-semibold text-[#3d4f3e] dark:text-[#f0f7f2]">{review.name}</span>
            <p className="text-xs text-gray-400 dark:text-[#7a9e85]">{formatDate(review.created_at)}</p>
          </div>

          {/* Applaud button */}
          <button
            onClick={handleApplaud}
            disabled={applauded}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all ${
              applauded
                ? 'bg-[#4a7c59] text-white border-[#4a7c59]'
                : 'border-gray-200 dark:border-[#2d5a3d] text-gray-500 dark:text-[#7a9e85] hover:border-[#4a7c59] hover:text-[#4a7c59]'
            }`}
          >
            👏 {count > 0 ? count : ''} Helpful
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} className="max-w-full max-h-full rounded-xl object-contain" alt="" />
          <button className="absolute top-4 right-4 text-white text-2xl leading-none">×</button>
        </div>
      )}
    </>
  );
}

export default function ReviewsDisplay() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef             = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setReviews(data.reviews.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === 'next' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#f5f8f5] to-white dark:from-[#0f1f17] dark:to-[#162d20] relative overflow-hidden">
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#7c8c7d]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#7c8c7d]/4 rounded-full blur-3xl" />

      <div className="w-11/12 max-w-7xl mx-auto relative">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-[#3d4f3e] dark:text-[#f0f7f2] mb-3">
            What Our Customers Say 💚
          </h2>
          <p className="text-gray-500 dark:text-[#7a9e85] text-base">Real reviews from real customers</p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#7c8c7d] via-[#c8a882] to-[#7c8c7d] rounded-full mx-auto mt-5" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <svg className="w-8 h-8 animate-spin text-[#7c8c7d]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}

        {/* No reviews */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-6">
              Be the first to share your experience with Promise Organics! 🌿
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#7c8c7d] text-white px-8 py-3 rounded-full font-medium hover:bg-[#6b7a6c] transition-colors"
            >
              Write a Review
            </Link>
          </div>
        )}

        {/* Reviews carousel */}
        {!loading && reviews.length > 0 && (
          <div className="relative">
            {/* Left arrow */}
            {reviews.length > 3 && (
              <button
                onClick={() => scroll('prev')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#1e3d2a] shadow-md border border-gray-200 dark:border-[#2d5a3d] flex items-center justify-center hover:bg-[#4a7c59] hover:text-white transition-colors"
              >
                ←
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-80"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            {/* Right arrow */}
            {reviews.length > 3 && (
              <button
                onClick={() => scroll('next')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#1e3d2a] shadow-md border border-gray-200 dark:border-[#2d5a3d] flex items-center justify-center hover:bg-[#4a7c59] hover:text-white transition-colors"
              >
                →
              </button>
            )}
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-block text-[#7c8c7d] border border-[#7c8c7d] px-8 py-3 rounded-full font-medium hover:bg-[#7c8c7d] hover:text-white transition-all duration-200"
            >
              Write a Review
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
