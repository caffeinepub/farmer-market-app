// Stub — Cart functionality removed in Job Portal. Kept to avoid import errors.
export interface CartItem {
  product: { id: string; name: string };
  quantity: number;
}

export function useCart() {
  return {
    cartItems: [] as CartItem[],
    cartTotal: 0,
    cartCount: 0,
    addToCart: (_product: unknown, _qty: number) => {},
    removeFromCart: (_id: string) => {},
    updateQuantity: (_id: string, _qty: number) => {},
    clearCart: () => {},
  };
}
