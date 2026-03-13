import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignUp from '../../Pages/auth/SignUp'
import { useUserStore } from '../../store/userStore'

const renderSignUp = () => render(
  <BrowserRouter><SignUp /></BrowserRouter>
)

afterEach(() => {
  localStorage.clear()
  useUserStore.setState({ user: null, token: null, isLoading: false })
})

describe('Register Page', () => {

  test('renders all register form fields', () => {
    renderSignUp()
    // SignUp.jsx has separate firstName / lastName fields
    expect(screen.getByPlaceholderText('Thato')).toBeInTheDocument()           // firstName
    expect(screen.getByPlaceholderText('Mokoena')).toBeInTheDocument()         // lastName
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Min. 6 characters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  test('shows error when passwords do not match', async () => {
    renderSignUp()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('Thato'),            'Test')
    await user.type(screen.getByPlaceholderText('Mokoena'),          'User')
    await user.type(screen.getByPlaceholderText('name@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Min. 6 characters'),'password123')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'different')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      // SignUp.jsx: setError('Passwords do not match.')
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  test('shows error when password is too short', async () => {
    renderSignUp()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('Thato'),            'Test')
    await user.type(screen.getByPlaceholderText('Mokoena'),          'User')
    await user.type(screen.getByPlaceholderText('name@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Min. 6 characters'),'12345')   // 5 chars
    await user.type(screen.getByPlaceholderText('Repeat your password'), '12345')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      // SignUp.jsx: setError('Password must be at least 6 characters.')
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
    })
  })

  test('shows error when name fields contain only whitespace', async () => {
    renderSignUp()
    const user = userEvent.setup()

    // Type a single space in each name field: passes HTML5 `required` (non-empty)
    // but fails SignUp.jsx trim() check → setError('Please enter your full name.')
    await user.type(screen.getByPlaceholderText('Thato'),   ' ')
    await user.type(screen.getByPlaceholderText('Mokoena'), ' ')
    await user.type(screen.getByPlaceholderText('name@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Min. 6 characters'),'password123')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      // SignUp.jsx: setError('Please enter your full name.')
      expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument()
    })
  })

  test('successfully registers a new user', async () => {
    renderSignUp()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('Thato'),            'Test')
    await user.type(screen.getByPlaceholderText('Mokoena'),          'User')
    await user.type(screen.getByPlaceholderText('name@example.com'), 'newuser@test.com')
    await user.type(screen.getByPlaceholderText('Min. 6 characters'),'password123')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      // MSW register handler returns fake-jwt-token-123
      expect(useUserStore.getState().token).toBe('fake-jwt-token-123')
    }, { timeout: 3000 })
  })

  test('has link back to sign in page', () => {
    renderSignUp()
    // SignUp.jsx: "Already have an account? Sign in"
    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
  })

})
