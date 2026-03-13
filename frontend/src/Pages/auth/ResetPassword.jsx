import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import promiseLogo from '@/assets/promise-logo.png'

const API = import.meta.env.VITE_API_URL || ''

const ResetPassword = () => {
  const params    = new URLSearchParams(window.location.search)
  const token     = params.get('token')
  const navigate  = useNavigate()

  const [newPassword, setNewPassword]     = useState('')
  const [confirm, setConfirm]             = useState('')
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)
  const [errorMessage, setErrorMessage]   = useState('')
  const [matchError, setMatchError]       = useState('')

  // Auto-redirect after success
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => navigate('/login'), 3000)
    return () => clearTimeout(timer)
  }, [success, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setMatchError('')

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirm) {
      setMatchError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res  = await fetch(`${API}/api/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setSuccess(true)
      } else {
        setErrorMessage(data.message || 'This reset link is invalid or has expired.')
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'border border-gray-200 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60'

  // No token in URL
  if (!token) {
    return (
      <section className="flex flex-col items-center bg-[#ebecf1] dark:bg-[#0f1f17] justify-center md:h-screen h-svh">
        <div className="bg-white dark:bg-[#1e3d2a] p-6 w-11/12 lg:w-1/3 mx-auto rounded-md shadow-sm text-center">
          <Link to="/">
            <img src={promiseLogo} alt="Promise Organics" className="h-10 mx-auto mb-6 object-contain" />
          </Link>
          <p className="text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm mb-6">
            Invalid reset link. Please request a new one.
          </p>
          <Link to="/forgot-password" className="text-[#7c8c7d] font-medium hover:underline text-sm">
            ← Request a new reset link
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col items-center bg-[#ebecf1] dark:bg-[#0f1f17] justify-center md:h-screen h-svh">
      <div className="bg-white dark:bg-[#1e3d2a] p-6 w-11/12 lg:w-1/3 mx-auto rounded-md shadow-sm">

        {/* Back link */}
        <Link
          to="/login"
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-[#7a9e85] hover:text-green-700 transition-colors mb-6"
        >
          ← Back to Sign In
        </Link>

        {/* Logo + heading */}
        <div className="text-center mb-6">
          <Link to="/">
            <img src={promiseLogo} alt="Promise Organics" className="h-10 mx-auto mb-4 object-contain" />
          </Link>
          <h4 className="text-3xl font-semibold mb-2 title dark:text-[#f0f7f2]">Create New Password</h4>
          <p className="text-gray-500 dark:text-[#7a9e85] text-sm">Enter your new password below</p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="text-center">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-emerald-700 text-sm mb-6">
              ✅ Password reset successfully!
            </div>
            <Link
              to="/login"
              className="inline-block bg-[#7c8c7d] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#6b7a6c] transition-colors text-sm"
            >
              Go to Sign In →
            </Link>
            <p className="text-xs text-gray-400 dark:text-[#7a9e85] mt-3">Redirecting in 3 seconds…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <label className="font-semibold opacity-70 text-sm dark:text-[#c8dece]">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              className={inputClass}
            />
            <p className="text-xs text-gray-400 dark:text-[#7a9e85] -mt-1 mb-3 ml-1">Minimum 8 characters</p>

            {/* Confirm Password */}
            <label className="font-semibold opacity-70 text-sm dark:text-[#c8dece]">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setMatchError('') }}
              placeholder="Repeat your password"
              required
              className={inputClass}
            />
            {matchError && (
              <p className="text-rose-500 text-xs mb-3 ml-1">{matchError}</p>
            )}

            {/* General error */}
            {errorMessage && (
              <div className="text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2 text-sm mb-3">
                {errorMessage}{' '}
                {errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('expired') ? (
                  <Link to="/forgot-password" className="underline font-medium">Request a new link</Link>
                ) : null}
              </div>
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
                  Resetting…
                </>
              ) : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default ResetPassword
