import { Link } from 'react-router-dom'

export default function PaymentCancelled() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* X circle */}
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-[#f0f7f2] mb-3">Payment Cancelled</h1>

      <p className="text-gray-600 dark:text-[#c8dece] max-w-sm mb-8 leading-relaxed">
        Your payment was not completed. Your cart has been saved — you can try again whenever you're ready.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/checkout"
          className="inline-block bg-[#4a7c59] text-white font-semibold px-7 py-3 rounded-sm hover:bg-[#2d5a3d] transition-colors"
        >
          Try Again
        </Link>
        <Link
          to="/shop"
          className="inline-block border border-gray-300 dark:border-[#2d5a3d] text-gray-700 dark:text-[#c8dece] font-medium px-7 py-3 rounded-sm hover:border-gray-400 dark:hover:border-[#4a7c59] hover:text-gray-900 dark:hover:text-[#f0f7f2] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  )
}
