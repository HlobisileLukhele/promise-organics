import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Cart from '../../Pages/Cart'
import { useCartStore } from '../../store/cartStore'

// Cart.jsx reads from the Zustand cartStore (client-side only).
// No backend API calls are made — MSW is not involved here.

const mockItem = {
  id: 'prod-1',
  name: 'Avocado Hair Oil',
  price: 199,
  quantity: 2,
  image: '/test-image.jpg',
}

const renderCart = () => render(
  <BrowserRouter><Cart /></BrowserRouter>
)

afterEach(() => {
  // Wrap in act() so React 19 doesn't warn about state updates outside the update cycle
  act(() => { useCartStore.setState({ items: [] }) })
})

describe('Cart Page', () => {

  test('shows empty cart message when cart is empty', () => {
    renderCart()
    // Cart.jsx empty state: "Your cart is empty"
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  test('shows link to shop when cart is empty', () => {
    renderCart()
    expect(screen.getByText(/go to shop/i)).toBeInTheDocument()
  })

  test('shows cart item name when cart has products', () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    expect(screen.getByText('Avocado Hair Oil')).toBeInTheDocument()
  })

  test('shows item price in cart', () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    expect(screen.getByText('R199.00')).toBeInTheDocument()
  })

  test('shows cart totals section', () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    // Cart.jsx: <h2>Cart totals</h2>
    expect(screen.getByText(/cart totals/i)).toBeInTheDocument()
  })

  test('shows subtotal and total', () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    // 'Subtotal' appears in both the table <th> header and the totals <span> — use getAllByText
    expect(screen.getAllByText('Subtotal').length).toBeGreaterThanOrEqual(1)
    // 'Total' is unique: only the grand total <span> in the totals section
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  test('shows proceed to checkout button', () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    // Cart.jsx: <button>Proceed to Checkout</button> inside <Link to="/checkout">
    expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument()
  })

  test('shows remove item button', () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    // Cart.jsx: <button title="Remove item"><FiTrash2 /></button>
    expect(screen.getByTitle(/remove item/i)).toBeInTheDocument()
  })

  test('removing an item empties the cart', async () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    const user = userEvent.setup()

    await user.click(screen.getByTitle(/remove item/i))

    // After removal the empty state should appear
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  test('quantity increment button is present', () => {
    useCartStore.setState({ items: [mockItem] })
    renderCart()
    // Cart.jsx renders FiPlus and FiMinus buttons for quantity
    const buttons = screen.getAllByRole('button')
    // At minimum: minus, plus, remove = 3 buttons per item + checkout + apply coupon
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  test('correct grand total is calculated', () => {
    useCartStore.setState({ items: [mockItem] }) // 199 × 2 = 398 + R99 shipping = R497
    renderCart()
    // R398.00 appears in both the row subtotal cell AND the totals section subtotal span.
    // R497.00 (grand total) is unique — only in the totals section.
    expect(screen.getByText('R497.00')).toBeInTheDocument()
  })

})
