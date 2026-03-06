import { create } from 'zustand'

export const useWishlistStore = create((set) => ({
  items: [],

  addItem: (product) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === product.id)
      if (exists) return state
      return { items: [...state.items, product] }
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
}))
