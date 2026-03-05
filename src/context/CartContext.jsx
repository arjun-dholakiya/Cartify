import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();

  const cartKey = user ? `cartify_cart_${user.id}` : null;

  const [items, setItems] = useState([]);

  // Load cart when user changes
  useEffect(() => {
    if (!cartKey) {
      setItems([]);
      return;
    }

    const stored = localStorage.getItem(cartKey);

    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems([]);
    }
  }, [cartKey]);

  // Save cart
  useEffect(() => {
    if (!cartKey) return;

    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, cartKey]);

  // Add to cart
  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  // Remove item
  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Update quantity
  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;

    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Cart count
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Cart subtotal
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
