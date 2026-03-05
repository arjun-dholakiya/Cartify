import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

/* ─── Cart Item ────────────────────────────────────────────────
   Renders a single item in the shopping cart with:
   - Product image with fallback
   - Title + category
   - Quantity stepper (+ / -)
   - Subtotal price
   - Remove button (always visible on mobile, hover on desktop)
──────────────────────────────────────────────────────────────── */
export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  /* Remove item and show toast notification */
  const handleRemove = () => {
    removeFromCart(item.id);
    showToast(`Removed "${item.title.slice(0, 28)}…" from cart`, 'info');
  };

  return (
    <div
      className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-2xl transition-all hover:shadow-md group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      {/* ── Product Image ── */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0"
        style={{
          background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
          border: '1px solid var(--border)'
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${item.id}/160/160`;
          }}
        />
      </div>

      {/* ── Item Details ── */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-semibold line-clamp-2 leading-snug"
          style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
        >
          {item.title}
        </h4>
        <p
          className="text-xs mt-0.5 capitalize"
          style={{ color: 'var(--text-3)' }}
        >
          {item.category}
        </p>

        {/* ── Quantity Stepper + Price Row ── */}
        <div className="flex items-center justify-between gap-3 mt-3">
          {/* Quantity stepper */}
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ border: '1.5px solid var(--border)' }}
          >
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-30"
              style={{ color: 'var(--text-2)' }}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className="w-8 text-center text-sm font-bold"
              style={{ color: 'var(--text)' }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-50"
              style={{ color: 'var(--text-2)' }}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price + Remove button */}
          <div className="flex items-center gap-3">
            <span
              className="text-base font-bold"
              style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
            >
              ${(item.price * item.quantity).toFixed(2)}
            </span>

            {/* Remove — always visible on mobile, hover reveal on sm+ */}
            <button
              onClick={handleRemove}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-110 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              style={{ background: '#fef2f2', color: '#ef4444' }}
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
