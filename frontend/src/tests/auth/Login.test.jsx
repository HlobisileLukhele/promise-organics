import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignIn from '../../Pages/auth/SignIn'
import { useUserStore } from '../../store/userStore'

const renderSignIn = () => render(
  <BrowserRouter><SignIn /></BrowserRouter>
)

// Reset auth state and localStorage between every test
afterEach(() => {
  localStorage.clear()
  useUserStore.setState({ user: null, token: null, isLoading: false })
})

describe('Login Page', () => {

  test('renders login form correctly', () => {
    renderSignIn()
    // Email input — placeholder set in SignIn.jsx
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument()
    // Password input — placeholder is 10 dots
    expect(screen.getByPlaceholderText('..........')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('shows error when submitting empty form', async () => {
    renderSignIn()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      // HTML5 required validation marks the empty email input as invalid
      expect(document.querySelector('input:invalid')).toBeTruthy()
    })
  })

  test('accepts email and password input', async () => {
    renderSignIn()
    const user = userEvent.setup()

    const emailInput    = screen.getByPlaceholderText('name@example.com')
    const passwordInput = screen.getByPlaceholderText('..........')

    await user.type(emailInput,    'test@test.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@test.com')
    expect(passwordInput).toHaveValue('password123')
  })

  test('successful login stores token in zustand state', async () => {
    renderSignIn()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('name@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('..........'),       'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      // userStore persists {user, token} — check in-memory state directly
      expect(useUserStore.getState().token).toBe('fake-jwt-token-123')
    }, { timeout: 3000 })
  })

  test('shows error message on wrong credentials', async () => {
    renderSignIn()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('name@example.com'), 'wrong@test.com')
    await user.type(screen.getByPlaceholderText('..........'),       'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      // MSW handler returns "Invalid email or password" for wrong@test.com
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('has link to register page', () => {
    renderSignIn()
    // SignIn.jsx: <Link to="/register">Create an account</Link>
    expect(screen.getByText(/create an account/i)).toBeInTheDocument()
  })

  test('has forgot password link', () => {
    renderSignIn()
    // SignIn.jsx: <Link to="/forgot-password">Forgot Password?</Link>
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

})
