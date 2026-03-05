import { useState } from 'react';
import { ShoppingCart, CheckCircle, Star, ImageOff } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

/* ─── Category Emojis Map ── */
const CATEGORY_EMOJIS = {
  "men's clothing": '👔',
  "women's clothing": '👗',
  electronics: '⚡',
  jewelery: '💎',
  'home & living': '🏠',
  'sports & fitness': '🏋️'
};

/*  Category → picsum seed mapping for fallback images */
const CATEGORY_SEEDS = {
  "men's clothing": ['men-fashion', 'shirt', 'clothing'],
  "women's clothing": ['women-fashion', 'dress', 'style'],
  electronics: ['technology', 'gadget', 'electronics'],
  jewelery: ['jewelry', 'gold', 'necklace'],
  'home & living': ['home-decor', 'interior', 'cozy'],
  'sports & fitness': ['fitness', 'sport', 'gym']
};

/* ─── Product Image with two-level error fallback ──
   Level 1: product image URL
   Level 2: picsum.photos seeded image (always works)
   Level 3: grey placeholder (practically never shown)
── */
function ProductImage({ src, alt, productId, category }) {
  const [stage, setStage] = useState(0); // 0=primary, 1=fallback, 2=error

  const fallbackUrl = `https://picsum.photos/seed/${productId || 'product'}/800/600`;

  if (stage === 2) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2"
        style={{ background: 'linear-gradient(145deg,#f1f5f9,#e2e8f0)' }}
      >
        <ImageOff className="w-8 h-8" style={{ color: 'var(--text-3)' }} />
        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
          No Image
        </span>
      </div>
    );
  }

  return (
    <img
      src={stage === 0 ? src : fallbackUrl}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      loading="lazy"
      onError={() => setStage((s) => s + 1)}
    />
  );
}

/* ─── Product Card ─────────────────────────────────────────────
   Displays a single product with image, rating, price, and
   an Add to Cart button. Shows a toast notification when added.
──────────────────────────────────────────────────────────────── */
export default function ProductCard({ product, index = 0 }) {
  const { addToCart, items } = useCart();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  /* Check if this product is already in cart */
  const inCart = items.some((i) => i.id === product.id);

  /* Handle add to cart with optimistic UI + toast */
  const handleAdd = async () => {
    if (inCart || adding) return;

    setAdding(true);
    addToCart(product);
    showToast(`Added "${product.title.slice(0, 30)}…" to cart 🛒`, 'success');

    await new Promise((r) => setTimeout(r, 600));

    setAdding(false);
  };

  /* Star rating computation */
  const rating = product.rating?.rate || 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  const emoji = CATEGORY_EMOJIS[product.category] || '🛍️';

  /* Truncate long descriptions to 80 chars */
  const shortDesc = product.description
    ? product.description.length > 80
      ? product.description.substring(0, 80).trim() + '…'
      : product.description
    : null;

  return (
    <div
      className="product-card group fade-in flex flex-col"
      style={{
        animationDelay: `${index * 0.04}s`,
        animationFillMode: 'both',
        opacity: 0
      }}
    >
      {/* ── Product Image Area ── */}
      <div
        className="relative h-44 sm:h-52 overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#f8fafc,#f1f5f9)' }}
      >
        <ProductImage
          src={product.image}
          alt={product.title}
          productId={product.id}
          category={product.category}
        />

        {/* Category badge */}
        <span
          className="absolute top-3 left-3 text-[9px] sm:text-[10px] font-semibold px-2 py-1 rounded-full capitalize"
          style={{
            background: 'rgba(255,255,255,0.9)',
            color: 'var(--text-2)',
            backdropFilter: 'blur(6px)'
          }}
        >
          {emoji} {product.category}
        </span>

        {/* Rating badge */}
        <span
          className="absolute top-3 right-3 flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full"
          style={{
            background: 'rgba(5,150,105,0.12)',
            color: 'var(--primary)'
          }}
        >
          <Star className="w-3 h-3 fill-current" />
          {rating.toFixed(1)}
        </span>
      </div>

      {/* Product Info*/}
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <div className="flex-1">
          <h3
            className="text-[12px] sm:text-[13.5px] font-semibold leading-snug line-clamp-2"
            style={{ color: 'var(--text)', fontFamily: "'Syne', sans-serif" }}
          >
            {product.title}
          </h3>

          {shortDesc && (
            <p
              className="text-[10px] sm:text-[11px] leading-relaxed mt-1 line-clamp-2"
              style={{ color: 'var(--text-3)' }}
            >
              {shortDesc}
            </p>
          )}

          {/* Star rating row */}
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i <= fullStars
                    ? 'fill-current'
                    : i === fullStars + 1 && hasHalf
                      ? 'fill-current opacity-50'
                      : 'opacity-20'
                }`}
                style={{ color: 'var(--accent)' }}
              />
            ))}

            <span
              className="text-[10px] sm:text-[11px] ml-0.5"
              style={{ color: 'var(--text-3)' }}
            >
              ({product.rating?.count})
            </span>
          </div>
        </div>

        {/* ── Price + Add to Cart ── */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <span
            className="text-base sm:text-lg font-bold"
            style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
          >
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAdd}
            disabled={adding}
            className={`flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-300 ${
              inCart ? 'cursor-default' : 'hover:scale-105 active:scale-95'
            }`}
            style={
              inCart
                ? {
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: '1.5px solid var(--primary-mid)'
                  }
                : adding
                  ? {
                      background: 'var(--primary-glow)',
                      color: 'var(--primary)',
                      border: '1.5px solid var(--primary)'
                    }
                  : {
                      background:
                        'linear-gradient(135deg,var(--primary),var(--primary-mid))',
                      color: 'white',
                      boxShadow: '0 4px 12px var(--primary-glow)'
                    }
            }
          >
            {inCart ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> In Cart
              </>
            ) : adding ? (
              <>
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full spin" />
                Adding…
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
