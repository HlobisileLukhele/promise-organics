import { useState } from 'react'
import { Link } from 'react-router-dom'
import promiseLogo from '@/assets/promise-logo.png'

const API = import.meta.env.VITE_API_URL || ''

const ForgotPassword = () => {
  const [email, setEmail]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-center bg-[#ebecf1] dark:bg-[#0f1f17] justify-center md:h-screen h-svh">
      <div className="bg-white dark:bg-[#1e3d2a] p-6 w-11/12 lg:w-1/3 mx-auto h-auto rounded-md shadow-sm dark:shadow-[#0a1510]">

        {/* Back link */}
        <Link
          to="/login"
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-[#7a9e85] hover:text-green-700 dark:hover:text-[#4a7c59] transition-colors mb-6"
        >
          ← Back to Sign In
        </Link>

        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/">
            <img src={promiseLogo} alt="Promise Organics" className="h-10 mx-auto mb-4 object-contain" />
          </Link>
          <h4 className="text-3xl font-semibold mb-2 title dark:text-[#f0f7f2]">Forgot Password</h4>
          <p className="text-gray-500 dark:text-[#7a9e85] text-sm">Enter your email and we'll send you a reset link</p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-emerald-700 text-sm text-center leading-relaxed">
            ✅ Check your email! A reset link has been sent to <strong>{email}</strong>. It expires in 1 hour.
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <label className="font-semibold opacity-70 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="border border-gray-200 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60"
              />

              {errorMessage && (
                <p className="text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2 text-sm mb-3">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#7c8c7d] text-white font-semibold outline-none py-2 px-4 rounded-md transform duration-200 hover:bg-[#7c8c7d]/90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending…
                  </>
                ) : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center my-4 text-sm dark:text-[#c8dece]">
              Remember your password?{' '}
              <Link to="/login" className="text-[#7c8c7d] font-medium hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default ForgotPassword
