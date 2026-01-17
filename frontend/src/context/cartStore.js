import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  error: null,

  setCart: (cart) => set({ cart }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  addToCart: (product) =>
    set((state) => {
      if (!state.cart) {
        return { cart: { items: [product] } };
      }

      const existingItem = state.cart.items.find(
        (item) =>
          item.product._id === product.product._id &&
          item.size === product.size &&
          item.color === product.color
      );

      if (existingItem) {
        return {
          cart: {
            ...state.cart,
            items: state.cart.items.map((item) =>
              item === existingItem
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            ),
          },
        };
      }

      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, product],
        },
      };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.filter((item) => item._id !== itemId),
      },
    })),

  clearCart: () => set({ cart: { items: [] } }),
}));

export default useCartStore;
