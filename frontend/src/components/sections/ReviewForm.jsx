import { useState } from 'react';
import { GoStarFill } from 'react-icons/go';
import { FiStar } from 'react-icons/fi';

const INITIAL = { name: '', message: '' };
const API = import.meta.env.VITE_API_URL || '';

export default function ReviewForm() {
  const [formData, setFormData]             = useState(INITIAL);
  const [rating, setRating]                 = useState(0);
  const [hovered, setHovered]               = useState(0);
  const [loading, setLoading]               = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage]     = useState('');
  const [images, setImages]                 = useState([]);
  const [imagePreviews, setImagePreviews]   = useState([]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file || images.length >= 2) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    setImages(prev => [...prev, file]);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => [...prev, reader.result]);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected if removed
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMessage('Please select a star rating.');
      return;
    }
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const imageBase64s = await Promise.all(
        images.map(file => new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }))
      );

      const res = await fetch(`${API}/api/reviews`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    formData.name,
          rating,
          message: formData.message,
          images:  imageBase64s,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Thank you! Your review will appear after approval. 🌿');
        setFormData(INITIAL);
        setRating(0);
        setImages([]);
        setImagePreviews([]);
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 dark:border-[#2d5a3d] rounded-xl bg-stone-50 dark:bg-[#162d20] dark:text-[#f0f7f2] focus:outline-none focus:border-[#7c8c7d] focus:ring-2 focus:ring-[#7c8c7d]/20 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-[#7a9e85]';

  const displayRating = hovered || rating;

  return (
    <section className="w-11/12 mx-auto mt-20 mb-12">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl text-[#3d4f3e] dark:text-[#f0f7f2] font-semibold mb-3">
          Share Your Experience 🌿
        </h2>
        <p className="text-gray-500 dark:text-[#7a9e85] text-sm">
          We'd love to hear what you think about our products
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#7c8c7d] to-transparent mx-auto mt-4" />
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#1e3d2a] rounded-3xl shadow-lg border border-gray-100 dark:border-[#2d5a3d] p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className={inputClass}
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-3xl transition-transform duration-100 hover:scale-110 focus:outline-none"
                >
                  {star <= displayRating
                    ? <GoStarFill className="text-[#7c8c7d]" />
                    : <FiStar className="text-gray-300" />
                  }
                </button>
              ))}
              {rating > 0 && (
                <span className="self-center text-sm text-gray-500 dark:text-[#7a9e85] ml-2">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-2">Your Review</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your experience with this product..."
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-[#2d5a3d] rounded-2xl bg-stone-50 dark:bg-[#162d20] dark:text-[#f0f7f2] focus:outline-none focus:border-[#7c8c7d] focus:ring-2 focus:ring-[#7c8c7d]/20 transition-all resize-none text-sm placeholder:text-gray-400 dark:placeholder:text-[#7a9e85]"
            />
          </div>

          {/* Image upload */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-[#c8dece] block mb-2">
              Add Photos (optional, max 2)
            </label>

            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-[#2d5a3d]"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < 2 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-[#2d5a3d] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#4a7c59] transition-colors">
                  <span className="text-2xl text-gray-400">+</span>
                  <span className="text-xs text-gray-400 mt-1">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>

            <p className="text-xs text-gray-400 dark:text-[#7a9e85] mt-1">JPG, PNG up to 5MB each</p>
          </div>

          {/* Success / Error */}
          {successMessage && (
            <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-center">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-sm text-center">
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c8c7d] text-white px-8 py-3.5 rounded-full font-medium transition-all hover:bg-[#6b7a6c] hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 dark:text-[#7a9e85] mt-5">
          All reviews are moderated before being published.
        </p>
      </div>
    </section>
  );
}
