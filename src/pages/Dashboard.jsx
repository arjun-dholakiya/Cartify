import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowRight,
  PackagePlusIcon
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StatsCard from '../components/dashboard/StatsCard';
import ProductCard from '../components/products/ProductCard';
import { fetchProducts } from '../services/api';

/* ─── Category display maps ── */
const CATEGORY_EMOJIS = {
  "men's clothing": '👔',
  "women's clothing": '👗',
  electronics: '⚡',
  jewelery: '💎',
  'home & living': '🏠',
  'sports & fitness': '🏋️'
};

const BG_PALETTES = [
  '#d1fae5' /* emerald-100  — Men's Clothing */,
  '#fef3c7' /* amber-100    — Women's Clothing */,
  '#ccfbf1' /* teal-100     — Electronics */,
  '#fef9c3' /* yellow-100   — Jewellery */,
  '#dcfce7' /* green-100    — Home & Living */,
  '#ffedd5' /* orange-100   — Sports & Fitness */
];
const ICON_PALETTES = [
  '#059669' /* emerald       — matches --primary */,
  '#d97706' /* amber-dark    — matches --accent-dark */,
  '#0d9488' /* teal-600 */,
  '#ca8a04' /* yellow-600 */,
  '#16a34a' /* green-600 */,
  '#ea580c' /* orange-600 */
];

export default function Dashboard() {
  /* Auth context — get current user data */
  const { user } = useAuth();
  /* Cart context — get count and subtotal for stats */
  const { cartCount, subtotal } = useCart();

  const [featured, setFeatured] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* API Call: Fetch products on mount */
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setAllProducts(data);

        /* Sort by rating and take top 4 for featured section */
        const top = [...data]
          .sort((a, b) => b.rating.rate - a.rating.rate)
          .slice(0, 4);

        setFeatured(top);

        /* Extract unique category names */
        const cats = Array.from(new Set(data.map((p) => p.category)));

        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Stats Data */
  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: loading ? '—' : allProducts.length,
      color: 'emerald',
      trend: '↑ 36 items'
    },
    {
      icon: ShoppingCart,
      label: 'Cart Items',
      value: cartCount,
      color: 'amber',
      trend: cartCount > 0 ? `${cartCount} items` : 'Empty'
    },
    {
      icon: DollarSign,
      label: 'Cart Value',
      value: `$${subtotal.toFixed(2)}`,
      color: 'teal',
      trend: subtotal > 0 ? 'Ready to checkout' : 'Add items'
    },
    {
      icon: TrendingUp,
      label: 'Categories',
      value: loading ? '—' : categories.length,
      color: 'violet',
      trend: 'Browse all'
    }
  ];

  /* Time-based greeting (IST) */
  const hour = Number(
    new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      hour12: false
    })
  );

  let greeting;

  if (hour < 12) {
    greeting = '🌅 Good morning';
  } else if (hour < 16) {
    greeting = '☀️ Good afternoon';
  } else if (hour < 20) {
    greeting = '🌇 Good evening';
  } else {
    greeting = '🌙 Good night';
  }

  return (
    <div className="flex flex-col gap-5 md:gap-7 fade-in">
      {/* Dashboard Hero Section */}
      <div
        className="relative overflow-hidden rounded-2xl md:rounded-3xl px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10"
        style={{
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e3a2f 50%, #064e3b 100%)'
        }}
      >
        {/* Decorative background circles — pointer-events-none so they never intercept clicks */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 sm:w-56 sm:h-56 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'var(--primary)' }}
        />

        <div
          className="absolute -bottom-10 right-32 w-28 h-28 sm:w-32 sm:h-32 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'var(--accent)' }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="min-w-0">
            <p
              className="text-xs sm:text-sm font-medium mb-1.5"
              style={{ color: 'var(--primary-mid)', opacity: 0.9 }}
            >
              {greeting}
            </p>

            <h1
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>

            <p
              className="text-xs sm:text-sm mt-1.5 max-w-xs sm:max-w-sm"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              You have {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
              worth ${subtotal.toFixed(2)}.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-4 text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary), var(--primary-mid))',
                color: 'white',
                boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
              }}
            >
              <PackagePlusIcon className="w-4 h-4" />
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Shopping bag emoji — hidden on mobile to save space */}
          <div
            className="hidden sm:flex text-5xl md:text-6xl select-none shrink-0"
            style={{ filter: 'drop-shadow(0 8px 24px rgba(5,150,105,0.3))' }}
          >
            🛍️
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      {/* 2 columns on mobile, 4 on tablet+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      {/* Category Quick Links */}
      {!loading && categories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-base sm:text-lg font-bold"
              style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
            >
              Shop by Category
            </h2>

            <Link
              to="/products"
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category grid — 3 cols on mobile, 6 on desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {categories.map((cat, i) => {
              const count = allProducts.filter(
                (p) => p.category === cat
              ).length;

              return (
                <Link
                  key={cat}
                  to="/products"
                  className="flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center transition-all hover:scale-105 hover:shadow-md"
                  style={{
                    background: BG_PALETTES[i % BG_PALETTES.length],
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <span className="text-xl sm:text-2xl">
                    {CATEGORY_EMOJIS[cat] || '🛍️'}
                  </span>

                  <div>
                    <p
                      className="text-[10px] sm:text-[11px] font-bold capitalize leading-tight"
                      style={{ color: ICON_PALETTES[i % ICON_PALETTES.length] }}
                    >
                      {cat}
                    </p>

                    <p
                      className="text-[9px] sm:text-[10px]"
                      style={{ color: 'var(--text-3)' }}
                    >
                      {count} items
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Rated Products Section */}
      <div className="pb-2">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div>
            <h2
              className="text-base sm:text-lg font-bold"
              style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
            >
              ⭐ Top Rated
            </h2>

            <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>
              Highest rated picks for you
            </p>
          </div>

          <Link
            to="/products"
            className="flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Skeleton loaders while fetching */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="skeleton h-52" />

                <div className="p-4 flex flex-col gap-2.5">
                  <div className="skeleton h-4 rounded-lg" />
                  <div className="skeleton h-3 rounded-lg w-3/4" />
                  <div className="skeleton h-9 rounded-xl mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Product grid — 1 col mobile, 2 tablet, 4 desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
