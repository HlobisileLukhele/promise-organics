import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "@/store/userStore"

const SignUp = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const register = useUserStore((state) => state.register)
  const isLoading = useUserStore((state) => state.isLoading)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.firstName.trim() || !form.lastName.trim()) {
      return setError('Please enter your full name.')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.')
    }

    const result = await register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    if (!result.success) return setError(result.message)
    navigate('/account')
  }

  return (
    <section className="flex flex-col items-center bg-[#ebecf1] justify-center min-h-screen py-10">
      <div className="bg-white p-6 w-11/12 lg:w-1/3 mx-auto h-auto rounded-md shadow-sm">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-semibold my-3">Create an account</h4>
          <p className="text-gray-500 text-sm">Join us for a better shopping experience</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="font-semibold opacity-70 text-sm">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Thato"
                value={form.firstName}
                onChange={handleChange}
                required
                className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60"
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold opacity-70 text-sm">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Mokoena"
                value={form.lastName}
                onChange={handleChange}
                required
                className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60"
              />
            </div>
          </div>

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

          <label className="font-semibold opacity-70 text-sm">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60"
          />

          <label className="font-semibold opacity-70 text-sm">Confirm Password</label>
          <input
            type="password"
            name="confirm"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={handleChange}
            required
            className="border border-gray-200 block rounded-md px-4 py-1.5 outline-none my-2.5 w-full focus:border-[#7c8c7d]/60"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 w-full bg-[#7c8c7d] text-white font-semibold outline-none py-2 px-4 rounded-md transform duration-200 hover:bg-[#7c8c7d]/90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center my-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7c8c7d] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </section>
  )
}

export default SignUp
