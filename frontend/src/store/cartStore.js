import { create } from 'zustand'
import { useUserStore } from './userStore'
import { apiFetch } from '@/utils/api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const getToken = () => useUserStore.getState().token

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: async (product) => {
    // Update local state immediately
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + (product.quantity || 1) }
              : i
          ),
        }
      }
      return { items: [...state.items, { ...product, quantity: product.quantity || 1 }] }
    })

    // Sync to backend and store the returned cartItemId
    const token = getToken()
    if (token) {
      try {
        const res = await apiFetch(`${API}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: product.id, quantity: product.quantity || 1 }),
        })
        const data = await res.json()
        if (data.success && data.data?.id) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === product.id ? { ...i, cartItemId: data.data.id } : i
            ),
          }))
        }
      } catch (err) {
        console.error('Cart sync error:', err)
      }
    }
  },

  removeItem: async (id) => {
    const item = get().items.find((i) => i.id === id)

    // Update local state immediately
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }))

    const token = getToken()
    if (token && item?.cartItemId) {
      try {
        await apiFetch(`${API}/api/cart/${item.cartItemId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (err) {
        console.error('Cart remove error:', err)
      }
    }
  },

  updateQuantity: async (id, quantity) => {
    const item = get().items.find((i) => i.id === id)
    const safeQty = quantity < 1 ? 1 : quantity

    // Update local state immediately
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: safeQty } : i
      ),
    }))

    const token = getToken()
    if (token && item?.cartItemId) {
      try {
        await apiFetch(`${API}/api/cart/${item.cartItemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ quantity: safeQty }),
        })
      } catch (err) {
        console.error('Cart update error:', err)
      }
    }
  },

  loadCart: async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success && data.data) {
        set({
          items: data.data.map((ci) => ({
            id:         ci.product.id,
            cartItemId: ci.id,
            name:       ci.product.name,
            price:      ci.product.price,
            image_url:  ci.product.image_url,
            quantity:   ci.quantity,
          })),
        })
      }
    } catch (err) {
      console.error('Cart load error:', err)
    }
  },

  clearCart: () => set({ items: [] }),
}))
