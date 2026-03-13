import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import ForgotPassword from '../../Pages/auth/ForgotPassword'

// ForgotPassword uses fetch(VITE_API_URL + '/api/auth/forgot-password').
// .env.test sets VITE_API_URL=http://localhost:5000, which MSW intercepts.

const renderForgotPassword = () => render(
  <BrowserRouter><ForgotPassword /></BrowserRouter>
)

describe('Forgot Password Page', () => {

  test('renders forgot password form', () => {
    renderForgotPassword()
    // ForgotPassword.jsx: <h4>Forgot Password</h4>
    expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument()
    // Button text: 'Send Reset Link'
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  test('shows success message after submitting email', async () => {
    renderForgotPassword()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('name@example.com'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      // ForgotPassword.jsx success state: "✅ Check your email! A reset link has been sent to..."
      expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('success message includes the submitted email', async () => {
    renderForgotPassword()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('name@example.com'), 'test@test.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(screen.getByText(/test@test\.com/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('has link back to sign in', () => {
    renderForgotPassword()
    // ForgotPassword.jsx: <Link to="/login">← Back to Sign In</Link>
    expect(screen.getByText(/back to sign in/i)).toBeInTheDocument()
  })

  test('shows remember password sign in link', () => {
    renderForgotPassword()
    // ForgotPassword.jsx: "Remember your password? Sign in"
    expect(screen.getByText(/remember your password/i)).toBeInTheDocument()
  })

})
