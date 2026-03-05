import { useState } from 'react';
import { Shield, Truck, RotateCcw, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function CartSummary() {
  const { subtotal, items, clearCart } = useCart();
  const { showToast } = useToast();
  const [done, setDone] = useState(false);
  const [checking, setChecking] = useState(false);

  /* Simulate checkout — clears cart and shows toast */
  const handleCheckout = async () => {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 1200));
    clearCart();
    setChecking(false);
    setDone(true);
    showToast('Order placed successfully! 🎉', 'success');
    setTimeout(() => setDone(false), 5000);
  };

  /* Order placed confirmation state */
  if (done) {
    return (
      <div
        className="rounded-2xl p-6 text-center fade-in"
        style={{
          background: 'var(--primary-light)',
          border: '1.5px solid var(--primary)'
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: 'var(--primary)' }}
        >
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <p
          className="font-bold text-base"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: 'var(--primary-dark)'
          }}
        >
          Order Placed! 🎉
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--primary)' }}>
          Thank you for shopping with Cartify!
        </p>
      </div>
    );
  }

  /* Order calculations */
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 sticky top-20"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}
    >
      <h3
        className="font-bold text-base"
        style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
      >
        Order Summary
      </h3>

      {/* Line Items Breakdown */}
      <div className="flex flex-col gap-2.5 text-sm">
        <div
          className="flex justify-between"
          style={{ color: 'var(--text-2)' }}
        >
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div
          className="flex justify-between"
          style={{ color: 'var(--text-2)' }}
        >
          <span>Shipping</span>
          <span className="font-semibold" style={{ color: 'var(--primary)' }}>
            Free
          </span>
        </div>
        <div
          className="flex justify-between"
          style={{ color: 'var(--text-2)' }}
        >
          <span>Tax (8%)</span>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>
            ${tax.toFixed(2)}
          </span>
        </div>
        <div
          className="border-t pt-2.5 flex justify-between font-bold"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <span>Total</span>
          <span
            className="text-lg"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={checking}
        className="btn-primary w-full py-3"
      >
        {checking ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block spin" />{' '}
            Processing…
          </>
        ) : (
          <>Checkout — ${total.toFixed(2)}</>
        )}
      </button>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { icon: Shield, label: 'Secure Pay' },
          { icon: Truck, label: 'Free Ship' },
          { icon: RotateCcw, label: 'Easy Return' }
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary-light)' }}
            >
              <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            </div>
            <p
              className="text-[10px] font-medium"
              style={{ color: 'var(--text-3)' }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
