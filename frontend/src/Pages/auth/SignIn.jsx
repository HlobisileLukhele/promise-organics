import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "@/store/userStore"

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const login = useUserStore((state) => state.login)
  const isLoading = useUserStore((state) => state.isLoading)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login({ email: form.email.trim(), password: form.password })
    if (!result.success) return setError(result.message)
    navigate('/account')
  }

  return (
    <section className="flex flex-col items-center bg-[#ebecf1] justify-center md:h-screen h-svh">
      <div className="bg-white p-6 w-11/12 lg:w-1/3 mx-auto h-auto rounded-md shadow-sm">
        <div className="text-center mb-8">
          <h4 className="text-3xl font-semibold my-3 title">Welcome back</h4>
          <p className="text-gray-500 text-sm">Sign in to your Promise Organics account</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="font-semibold opacity-70 text-sm">Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60"
          />

          <div className="flex items-center justify-between mt-1">
            <label className="font-semibold opacity-70 text-sm">Password</label>
            <Link to="/forgot-password" className="text-[#7c8c7d] text-sm hover:underline">Forgot Password?</Link>
          </div>
          <input
            type="password"
            name="password"
            placeholder=".........."
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 w-full bg-[#7c8c7d] text-white font-semibold outline-none py-2 px-4 rounded-md transform duration-200 hover:bg-[#7c8c7d]/90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center my-4 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#7c8c7d] font-medium hover:underline">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default SignIn
