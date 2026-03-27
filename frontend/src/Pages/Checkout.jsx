import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { useCartStore } from '@/store/cartStore'
import { apiFetch } from '@/utils/api'
import { useJsApiLoader } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete'
import { FREE_SHIPPING_THRESHOLD, calculateShipping } from '@/utils/shipping'

// NOTE: Both "Places API" and "Places API (New)" must be enabled in Google Cloud Console
// for use-places-autocomplete to work correctly.

// Must be defined outside the component to prevent re-renders on every render cycle.
const PLACES_LIBRARIES = ['places']

const API = import.meta.env.VITE_API_URL || ''

const PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
]

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] outline-none focus:border-[#4a7c59] rounded-sm text-sm'

export default function Checkout() {
  const { token } = useUserStore()
  const localCartItems = useCartStore((state) => state.items)

  const [step, setStep] = useState(1)
  const [cartItems, setCartItems] = useState([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '',
    city: '', province: '', postalCode: '', phone: '',
  })

  // ── Google Maps loader ───────────────────────────────────────────────────────
  const { isLoaded: mapsLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '',
    libraries: PLACES_LIBRARIES,
  })

  // ── use-places-autocomplete hook (only active once Maps script is loaded) ────
  const {
    ready,
    value: addressInput,
    suggestions: { status, data: suggestions },
    setValue: setAddressInput,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: 'za' } },
    debounce: 300,
    // Defer initialisation until the Maps script is loaded
    initOnMount: mapsLoaded,
  })

  const handleAddressInput = (e) => {
    setAddressInput(e.target.value)
    setForm((f) => ({ ...f, address: e.target.value }))
  }

  const handleSuggestionSelect = async (description) => {
    setAddressInput(description, false)
    clearSuggestions()

    try {
      const results = await getGeocode({ address: description })
      const components = results[0]?.address_components ?? []

      const get = (types) =>
        components.find((c) => types.some((t) => c.types.includes(t)))?.long_name ?? ''

      const streetNumber = get(['street_number'])
      const route        = get(['route'])
      const address      = [streetNumber, route].filter(Boolean).join(' ') || description
      const suburb       = get(['sublocality_level_1', 'sublocality', 'neighborhood'])
      const city         = get(['locality']) || suburb
      const postalCode   = get(['postal_code'])
      const province     = get(['administrative_area_level_1'])

      setForm((f) => ({
        ...f,
        address,
        ...(city                                      && { city }),
        ...(postalCode                                && { postalCode }),
        ...(province && PROVINCES.includes(province) && { province }),
      }))
    } catch {
      // Geocode failed — keep the typed text as-is
      setForm((f) => ({ ...f, address: description }))
    }
  }

  // ── Fetch cart + billing from API on mount ──────────────────────────────────
  useEffect(() => {
    if (!token) { setLoadingCart(false); return }

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${API}/api/cart`, { headers }).then((r) => r.json()),
      fetch(`${API}/api/billing`, { headers }).then((r) => r.json()),
    ])
      .then(([cartRes, billingRes]) => {
        const items = (cartRes.data || []).map((ci) => ({
          id:       ci.id,
          name:     ci.product?.name ?? 'Product',
          price:    ci.product?.price ?? 0,
          image:    ci.product?.image_url ?? '',
          quantity: ci.quantity,
        }))
        setCartItems(items.length > 0 ? items : localCartItems)

        const b = billingRes.data
        if (b) {
          setForm({
            firstName:  b.first_name  ?? '',
            lastName:   b.last_name   ?? '',
            address:    b.address     ?? '',
            city:       b.city        ?? '',
            province:   b.province    ?? '',
            postalCode: b.postal_code ?? '',
            phone:      b.phone       ?? '',
          })
        }
      })
      .catch(() => setCartItems(localCartItems))
      .finally(() => setLoadingCart(false))
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal             = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping             = calculateShipping(subtotal)
  const total                = subtotal + shipping
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSaveBilling = async (e) => {
    e.preventDefault()
    setError('')

    const { firstName, lastName, address, city, province, postalCode } = form
    if (!firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !province || !postalCode.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      const res = await apiFetch(`${API}/api/billing`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          address,
          city,
          province,
          postal_code: postalCode,
          phone:       form.phone,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.message || 'Failed to save billing info.')
        return
      }
      setStep(2)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePlaceOrder = async () => {
    const authToken = useUserStore.getState().token
    console.log('Token:', authToken ? 'Found' : 'MISSING!')

    try {
      setLoading(true)
      console.log('Step 1: Creating order...')
      const orderRes = await apiFetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({}),
      })
      const orderData = await orderRes.json()
      console.log('Step 2: Order response:', orderData)
      if (!orderData.success) {
        alert('Failed to create order: ' + orderData.message)
        setLoading(false)
        return
      }
      const orderId = orderData.data?.id || orderData.data?.order_id
      console.log('Step 3: Order ID:', orderId)

      console.log('Step 4: Initiating Payfast payment...')
      const paymentRes = await apiFetch('http://localhost:5000/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ order_id: orderId }),
      })
      const paymentData = await paymentRes.json()
      console.log('Step 5: Payment response:', paymentData)
      if (!paymentData.success) {
        alert('Failed to initiate payment: ' + paymentData.message)
        setLoading(false)
        return
      }

      console.log('Step 6: Redirecting to Payfast...')
      const { payfastUrl, payload } = paymentData
      if (payfastUrl) {
        window.location.href = `${payfastUrl}?${new URLSearchParams(payload).toString()}`
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // ── Not logged in ────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="w-11/12 max-w-md mx-auto py-24 text-center">
        <p className="text-gray-600 dark:text-[#c8dece] mb-4">Please sign in to continue with checkout.</p>
        <Link to="/login" className="inline-block bg-[#4a7c59] text-white px-6 py-2.5 rounded-sm hover:bg-[#2d5a3d]">
          Sign In
        </Link>
      </div>
    )
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loadingCart) {
    return (
      <div className="w-11/12 mx-auto py-24 text-center text-gray-500 dark:text-[#7a9e85]">
        Loading checkout…
      </div>
    )
  }

  // ── Empty cart ───────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="w-11/12 mx-auto py-24 text-center">
        <p className="text-gray-600 dark:text-[#c8dece] mb-4">Your cart is empty.</p>
        <Link to="/shop" className="inline-block bg-[#4a7c59] text-white px-6 py-2.5 rounded-sm hover:bg-[#2d5a3d]">
          Browse the Shop
        </Link>
      </div>
    )
  }

  return (
    <section className="w-11/12 max-w-5xl mx-auto py-12">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
              ${step >= s ? 'bg-[#4a7c59] text-white' : 'bg-gray-200 dark:bg-[#162d20] text-gray-500 dark:text-[#7a9e85]'}`}>
              {s}
            </div>
            <span className={`text-sm ${step >= s ? 'text-[#4a7c59] font-medium' : 'text-gray-400 dark:text-[#7a9e85]'}`}>
              {s === 1 ? 'Billing Details' : 'Order Summary'}
            </span>
            {s < 2 && <span className="text-gray-300 dark:text-[#2d5a3d] mx-1">›</span>}
          </div>
        ))}
      </div>

      {/* Free shipping banner */}
      {subtotal > 0 && (
        <div className={`mb-6 px-4 py-3 text-sm font-medium rounded-sm border ${
          amountToFreeShipping === 0
            ? 'bg-[#e8f5ec] dark:bg-[#1a3d28] border-[#4a7c59] dark:border-[#4a7c59] text-[#2d5a3d] dark:text-[#a8d4b5]'
            : 'bg-[#f5f0e8] dark:bg-[#2d2a1e] border-[#c4a96a] dark:border-[#8a7040] text-[#5a4a1e] dark:text-[#d4be8a]'
        }`}>
          {amountToFreeShipping === 0
            ? '🎉 You qualify for FREE shipping!'
            : `Add R${amountToFreeShipping.toFixed(2)} more to your order and get FREE shipping!`
          }
        </div>
      )}

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm">
          {error}
        </div>
      )}

      {/* ── STEP 1: Billing Form ─────────────────────────────────────────────── */}
      {step === 1 && (
        <form onSubmit={handleSaveBilling} className="max-w-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-[#f0f7f2] mb-6">Billing Details</h2>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName" value={form.firstName} onChange={handleChange}
                placeholder="Thato" required className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName" value={form.lastName} onChange={handleChange}
                placeholder="Mokoena" required className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              value={ready ? addressInput : form.address}
              onChange={ready ? handleAddressInput : handleChange}
              placeholder="12 Jacaranda Street"
              required
              autoComplete="off"
              className={inputClass}
            />
            {status === 'OK' && suggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-[#162d20] border border-gray-200 dark:border-[#2d5a3d] rounded-sm shadow-lg max-h-52 overflow-y-auto text-sm">
                {suggestions.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    onMouseDown={() => handleSuggestionSelect(description)}
                    className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e3d2a] text-gray-800 dark:text-[#c8dece]"
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="city" value={form.city} onChange={handleChange}
                placeholder="Johannesburg" required className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                name="province" value={form.province} onChange={handleChange}
                required className={inputClass + ' bg-white dark:bg-[#162d20]'}
              >
                <option value="" disabled>Select province</option>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-1">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                name="postalCode" value={form.postalCode} onChange={handleChange}
                placeholder="2000" required className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-[#c8dece] mb-1">Phone</label>
              <input
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="082 123 4567" className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#4a7c59] text-white font-semibold py-3 rounded-sm hover:bg-[#2d5a3d] disabled:opacity-60 transition-colors"
          >
            {submitting ? 'Saving…' : 'Save & Continue'}
          </button>
        </form>
      )}

      {/* ── STEP 2: Order Summary ────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="max-w-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-[#f0f7f2] mb-6">Order Summary</h2>

          <div className="border border-gray-200 dark:border-[#2d5a3d] rounded-sm overflow-hidden mb-6">
            <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-[#7a9e85] uppercase tracking-wide bg-gray-50 dark:bg-[#162d20] px-4 py-2.5 border-b border-gray-200 dark:border-[#2d5a3d]">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start px-4 py-3 border-b border-gray-100 dark:border-[#2d5a3d] text-sm">
                <div>
                  <p className="font-medium text-gray-800 dark:text-[#f0f7f2]">{item.name}</p>
                  <p className="text-gray-400 dark:text-[#7a9e85] text-xs mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-700 dark:text-[#c8dece]">R{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="px-4 py-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-[#c8dece]">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-[#c8dece]">
                <span>Shipping</span>
                <span>
                  {shipping === 0
                    ? <span className="text-[#4a7c59] dark:text-[#a8d4b5] font-semibold">FREE</span>
                    : `R${shipping.toFixed(2)}`
                  }
                </span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 dark:text-[#f0f7f2] text-base pt-2 border-t border-gray-200 dark:border-[#2d5a3d]">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Accepted Payment Methods */}
          <div className="mt-4 mb-6 p-3 bg-gray-50 dark:bg-[#162d20] rounded-lg border border-gray-200 dark:border-[#2d5a3d]">
            <p className="text-sm text-gray-600 dark:text-[#c8dece] font-medium mb-2">Accepted Payment Methods</p>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white dark:bg-[#1e3d2a] border border-gray-200 dark:border-[#2d5a3d] dark:text-[#c8dece] rounded px-2 py-1">Visa</span>
              <span className="text-xs bg-white dark:bg-[#1e3d2a] border border-gray-200 dark:border-[#2d5a3d] dark:text-[#c8dece] rounded px-2 py-1">Mastercard</span>
              <span className="text-xs bg-white dark:bg-[#1e3d2a] border border-gray-200 dark:border-[#2d5a3d] dark:text-[#c8dece] rounded px-2 py-1">Instant EFT</span>
              <span className="text-xs bg-white dark:bg-[#1e3d2a] border border-gray-200 dark:border-[#2d5a3d] dark:text-[#c8dece] rounded px-2 py-1">American Express</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-[#7a9e85] mt-2">Secured by Payfast 🔒</p>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-colors
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4a7c59] hover:bg-[#2d5a3d]'}`}
          >
            {loading ? 'Processing...' : 'Proceed to Payment →'}
          </button>

          <button
            onClick={() => setStep(1)}
            className="mt-3 w-full text-sm text-gray-500 dark:text-[#7a9e85] hover:text-gray-700 dark:hover:text-[#c8dece] underline"
          >
            ← Edit billing details
          </button>
        </div>
      )}
    </section>
  )
}
