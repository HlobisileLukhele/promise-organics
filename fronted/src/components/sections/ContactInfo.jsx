import React from 'react'

function ContactInfo() {
    return (
        <div className="w-full md:w-1/2 bg-gradient-to-br from-stone-50 to-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100">
          {/* Header with decorative element */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Contact Information</h2>
            </div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[#8B9D83] to-transparent"></div>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            {/* Address */}
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#8B9D83] transition-colors">
                <svg className="w-5 h-5 text-[#8B9D83]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</h3>
                <p className="text-gray-800 leading-relaxed">205 Amanzimtoti road,<br />Durban, 4360</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#8B9D83] transition-colors">
                <svg className="w-5 h-5 text-[#8B9D83]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</h3>
                <a href="tel:+27686920418" className="text-gray-800 hover:text-[#8B9D83] transition-colors">
                  +27 79 616 1262 
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#8B9D83] transition-colors">
                <svg className="w-5 h-5 text-[#8B9D83]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</h3>
                <a href="mailto:sales@promiseorganics.com" className="text-gray-800 hover:text-[#8B9D83] transition-colors break-all">
                  sales@promiseorganics.co.za
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-200"></div>

          {/* Business Hours or Additional Info */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B9D83]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#8B9D83]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Business Hours</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monday - Friday: 9:00 AM - 5:00 PM<br />
                  Saturday: 10:00 AM - 2:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Links (Optional) */}
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-500 mb-4">Follow Us</p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#8B9D83] hover:bg-[#8B9D83] hover:text-white transition-all group">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#8B9D83] hover:bg-[#8B9D83] hover:text-white transition-all group">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#8B9D83] hover:bg-[#8B9D83] hover:text-white transition-all group">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      );
    }
    
export default ContactInfo;