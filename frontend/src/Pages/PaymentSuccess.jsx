import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'

export default function PaymentSuccess() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Checkmark circle */}
      <div className="w-20 h-20 rounded-full bg-[#e8f0eb] flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[#4a7c59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-[#f0f7f2] mb-3">🎉 Payment Successful!</h1>

      <p className="text-gray-600 dark:text-[#c8dece] max-w-sm mb-8 leading-relaxed">
        Your order has been confirmed. Thank you for shopping with Promise Organics!
        You will receive an email confirmation shortly.
      </p>

      <div className="bg-[#e8f0eb] border border-[#4a7c59]/20 rounded-sm px-6 py-4 mb-8 max-w-xs w-full">
        <p className="text-[#2d5a3d] text-sm font-medium">Order confirmed</p>
        <p className="text-[#4a7c59] text-xs mt-1">We'll notify you when your order is on its way.</p>
      </div>

      <Link
        to="/shop"
        className="inline-block bg-[#4a7c59] text-white font-semibold px-8 py-3 rounded-sm hover:bg-[#2d5a3d] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
