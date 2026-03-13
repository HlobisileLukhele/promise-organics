import { useState } from 'react';

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

const API = import.meta.env.VITE_API_URL || '';

export default function ContactForm() {
  const [formData, setFormData]         = useState(INITIAL);
  const [loading, setLoading]           = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage]     = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const { name, email, phone, subject, message } = formData;
    console.log('Sending contact form:', { name, email, subject, message });

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      console.log('Contact form response:', data);

      if (data.success) {
        setSuccessMessage("Thank you! We'll get back to you within 24 hours.");
        setFormData(INITIAL);
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-5 py-3.5 rounded-full border border-gray-300 dark:border-[#2d5a3d] bg-stone-50 dark:bg-[#162d20] dark:text-[#f0f7f2] focus:outline-none focus:border-[#8B9D83] focus:ring-2 focus:ring-[#8B9D83]/20 transition-all placeholder:text-gray-400 dark:placeholder:text-[#7a9e85]';

  return (
    <div className="w-full md:w-1/2 bg-white dark:bg-[#1e3d2a] p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 dark:border-[#2d5a3d]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-[#f0f7f2]">Get In Touch</h2>
        </div>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#8B9D83] to-transparent"></div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
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

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-2">
            Phone <span className="text-gray-400 dark:text-[#7a9e85] font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+27 00 000 0000"
            className={inputClass}
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            required
            className={inputClass}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            placeholder="Tell us how we can help you..."
            required
            className="w-full px-5 py-3.5 rounded-3xl border border-gray-300 dark:border-[#2d5a3d] bg-stone-50 dark:bg-[#162d20] dark:text-[#f0f7f2] focus:outline-none focus:border-[#8B9D83] focus:ring-2 focus:ring-[#8B9D83]/20 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-[#7a9e85]"
          />
        </div>

        {/* Success / Error messages */}
        {successMessage && (
          <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-center">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8B9D83] text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-[#7a8c72] hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Sending…</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
