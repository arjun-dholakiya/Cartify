import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

/* Empty Cart Illustration */
function EmptyCartIllustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 sm:py-20 fade-in">
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl shadow-lg"
        style={{
          background: 'linear-gradient(135deg, var(--primary-light), #a7f3d0)'
        }}
      >
        🛒
      </div>
      <div className="text-center px-4">
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
        >
          Your cart is empty
        </h2>
        <p
          className="text-sm mt-2 max-w-xs mx-auto"
          style={{ color: 'var(--text-2)' }}
        >
          Looks like you haven't added anything yet. Start shopping and fill it
          up!
        </p>
      </div>
      <Link to="/products" className="btn-primary px-6 py-3">
        Start Shopping <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function Cart() {
  const { items, clearCart } = useCart();
  const { showToast } = useToast();

  /* Empty state */
  if (items.length === 0) return <EmptyCartIllustration />;

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  /* Clear all items with toast confirmation */
  const handleClearCart = () => {
    clearCart();
    showToast('Cart cleared', 'info');
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6 fade-in">
      {/* Cart Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold"
            style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
          >
            Shopping Cart
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-all hover:scale-105"
          style={{ background: '#fef2f2', color: '#ef4444' }}
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      {/* Cart Layout: Items + Summary */}
      {/* Stacks vertically on mobile, row on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">
        {/* Cart Items List */}
        <div className="flex-1 flex flex-col gap-3 w-full">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Continue shopping link */}
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm font-medium mt-2 w-fit"
            style={{ color: 'var(--primary)' }}
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Panel */}
        <div className="w-full lg:w-80 shrink-0">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
