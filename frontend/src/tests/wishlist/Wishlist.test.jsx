import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Wishlist from '../../Pages/Wishlist'
import { useWishlistStore } from '../../store/wishlistStore'
import { useCartStore } from '../../store/cartStore'

// Wishlist.jsx reads from useWishlistStore (client-side Zustand).
// No backend API calls are made — MSW is not involved here.

const mockItem = {
  id: 'prod-1',
  name: 'Avocado Hair Oil',
  price: '199',
  image: '/test-image.jpg',
}

const renderWishlist = () => render(
  <BrowserRouter><Wishlist /></BrowserRouter>
)

afterEach(() => {
  act(() => {
    useWishlistStore.setState({ items: [] })
    useCartStore.setState({ items: [] })
  })
})

describe('Wishlist Page', () => {

  test('shows empty wishlist message when wishlist is empty', () => {
    renderWishlist()
    // Wishlist.jsx empty state: "Your wishlist is empty"
    expect(screen.getByText(/your wishlist is empty/i)).toBeInTheDocument()
  })

  test('shows browse the shop text when empty', () => {
    renderWishlist()
    expect(screen.getByText(/browse the shop/i)).toBeInTheDocument()
  })

  test('shows wishlist item name', () => {
    useWishlistStore.setState({ items: [mockItem] })
    renderWishlist()
    expect(screen.getByText('Avocado Hair Oil')).toBeInTheDocument()
  })

  test('shows item price', () => {
    useWishlistStore.setState({ items: [mockItem] })
    renderWishlist()
    // Wishlist.jsx: R{parseFloat(item.price).toFixed(2)}
    expect(screen.getByText('R199.00')).toBeInTheDocument()
  })

  test('shows add to cart button', () => {
    useWishlistStore.setState({ items: [mockItem] })
    renderWishlist()
    // Wishlist.jsx: <button>Add to cart</button>
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })

  test('shows remove button (icon button)', () => {
    useWishlistStore.setState({ items: [mockItem] })
    renderWishlist()
    // There are 2 buttons per item: "Add to cart" and the FaTimesCircle remove button
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  test('add to cart button moves item into cart store', async () => {
    useWishlistStore.setState({ items: [mockItem] })
    renderWishlist()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    // Item should now be in the cartStore
    const cartState = useCartStore.getState()
    expect(cartState.items).toHaveLength(1)
    expect(cartState.items[0].name).toBe('Avocado Hair Oil')
    expect(cartState.items[0].price).toBe(199)
  })

  test('wishlist item stays after adding to cart', async () => {
    useWishlistStore.setState({ items: [mockItem] })
    renderWishlist()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    // Wishlist.jsx only calls addToCart — it does not remove from wishlist
    const wishlistState = useWishlistStore.getState()
    expect(wishlistState.items).toHaveLength(1)
  })

  test('clicking remove button empties the wishlist', async () => {
    useWishlistStore.setState({ items: [mockItem] })
    renderWishlist()
    const user = userEvent.setup()

    // Wishlist.jsx: buttons are [Add to cart, RemoveIcon] — remove is the last button
    const buttons = screen.getAllByRole('button')
    const removeButton = buttons[buttons.length - 1]
    await user.click(removeButton)

    expect(screen.getByText(/your wishlist is empty/i)).toBeInTheDocument()
  })

  test('multiple wishlist items are all rendered', () => {
    const items = [
      { ...mockItem, id: 'prod-1', name: 'Avocado Hair Oil' },
      { id: 'prod-2', name: 'Rosemary Shampoo', price: '149', image: '/img2.jpg' },
    ]
    useWishlistStore.setState({ items })
    renderWishlist()
    expect(screen.getByText('Avocado Hair Oil')).toBeInTheDocument()
    expect(screen.getByText('Rosemary Shampoo')).toBeInTheDocument()
  })

})
