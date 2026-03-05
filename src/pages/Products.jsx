import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  Search,
  X,
  RefreshCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchCategories
} from '../services/api';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

/* Constants */
const ITEMS_PER_PAGE = 8;

/* Same palette as Dashboard — keeps category colors consistent across pages */
const CATEGORY_COLORS = {
  all: { bg: '#f1f5f9', text: '#475569' },
  "men's clothing": { bg: '#d1fae5', text: '#059669' },
  "women's clothing": { bg: '#fef3c7', text: '#d97706' },
  electronics: { bg: '#ccfbf1', text: '#0d9488' },
  jewelery: { bg: '#fef9c3', text: '#ca8a04' },
  'home & living': { bg: '#dcfce7', text: '#16a34a' },
  'sports & fitness': { bg: '#ffedd5', text: '#ea580c' }
};

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' }
];

const CATEGORY_EMOJIS = {
  all: '🛍️',
  "men's clothing": '👔',
  "women's clothing": '👗',
  electronics: '⚡',
  jewelery: '💎',
  'home & living': '🏠',
  'sports & fitness': '🏋️'
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    if (!showSort) return;
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSort]);

  /* Debounce search input (350ms) */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* API: Fetch products by category */
  const load = useCallback(async (cat) => {
    setLoading(true);
    setError('');
    try {
      const data =
        cat === 'all'
          ? await fetchProducts()
          : await fetchProductsByCategory(cat);
      setProducts(data);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* API: Fetch categories on mount */
  useEffect(() => {
    fetchCategories()
      .then((c) => setCategories(['all', ...c]))
      .catch(() => setCategories(['all']));
    load('all');
  }, []);

  /* Reload when active category changes */
  useEffect(() => {
    load(activeCategory);
    setCurrentPage(1);
  }, [activeCategory]);

  /* Filter + Sort Logic */
  const processed = useMemo(() => {
    /* Filter by search query (matches title or category) */
    let result = products.filter(
      (p) =>
        p.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    /* Apply sorting */
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [products, debouncedQuery, sortBy]);

  /* Pagination */
  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  /* Reset search and sort when category changes */
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Page Header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
        >
          Products
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
          Discover {products.length} products across {categories.length - 1}{' '}
          categories
        </p>
      </div>

      {/* Search + Sort Bar */}
      {/* Mobile: stacks vertically (search full-width, sort full-width) */}
      {/* Tablet+: side-by-side row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        {/* Search — full width always on mobile, auto-grows on sm+ */}
        <div className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search
              className="w-4 h-4 shrink-0"
              style={{ color: 'var(--text-3)' }}
            />
          </div>

          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pr-10"
            style={{ paddingLeft: '2.25rem' }}
          />

          {/* Clear search button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors hover:bg-gray-100"
            >
              <X className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} />
            </button>
          )}
        </div>

        {/* Sort dropdown — full width on mobile, auto on sm+ */}
        <div className="relative w-full sm:w-auto" ref={sortRef}>
          <button
            onClick={() => setShowSort((p) => !p)}
            className="btn-secondary gap-2 text-sm cursor-pointer w-full sm:w-auto justify-between sm:justify-center"
          >
            <ArrowUpDown className="w-4 h-4" />
            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Sort'}
          </button>
          {showSort && (
            <div
              className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-48 rounded-xl py-1.5 z-20 fade-in-fast"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setShowSort(false);
                    setCurrentPage(1);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm transition-colors hover:bg-gray-50 font-medium"
                  style={{
                    color:
                      sortBy === opt.value ? 'var(--primary)' : 'var(--text-2)',
                    fontWeight: sortBy === opt.value ? 600 : 400
                  }}
                >
                  {sortBy === opt.value && '✓ '}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      {/* Horizontally scrollable on mobile, wraps on larger screens */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const colors = CATEGORY_COLORS[cat] || {
            bg: '#f8fafc',
            text: '#475569'
          };
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={isActive ? 'category-badge-active' : 'category-badge'}
              style={
                isActive
                  ? {}
                  : {
                      background: colors.bg,
                      color: colors.text,
                      borderColor: 'transparent'
                    }
              }
            >
              <span>{CATEGORY_EMOJIS[cat] || '🛍️'}</span>
              {cat === 'all' ? 'All Products' : cat}
            </button>
          );
        })}
      </div>

      {/* Results Count + Clear */}
      {!loading && !error && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            Showing{' '}
            <span className="font-bold" style={{ color: 'var(--text)' }}>
              {Math.min(
                (currentPage - 1) * ITEMS_PER_PAGE + 1,
                processed.length
              )}
              –{Math.min(currentPage * ITEMS_PER_PAGE, processed.length)}
            </span>{' '}
            of{' '}
            <span className="font-bold" style={{ color: 'var(--text)' }}>
              {processed.length}
            </span>{' '}
            results
            {debouncedQuery && (
              <span>
                {' '}
                for "<em>{debouncedQuery}</em>"
              </span>
            )}
          </p>
          {debouncedQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: 'var(--primary)' }}
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && <LoadingSpinner text="Loading products…" />}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--accent-light)' }}
          >
            <AlertTriangle
              className="w-7 h-7"
              style={{ color: 'var(--accent-dark)' }}
            />
          </div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {error}
          </p>
          <button
            onClick={() => load(activeCategory)}
            className="btn-primary text-sm px-6"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && processed.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-4 text-center">
          <div className="text-5xl">🔍</div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>
              No products found
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
              Try a different search term or category.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="btn-secondary text-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      {/* key=activeCategory forces re-mount → triggers fade-in animation on every category switch */}
      {/* 1 col mobile, 2 tablet, 3 lg, 4 xl */}
      {!loading && !error && paginated.length > 0 && (
        <div
          key={activeCategory}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 fade-in"
        >
          {paginated.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2 flex-wrap">
          {/* Previous page */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-2)'
            }}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page number buttons */}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all"
              style={
                currentPage === num
                  ? {
                      background:
                        'linear-gradient(135deg, var(--primary), var(--primary-mid))',
                      color: 'white',
                      boxShadow: '0 4px 12px var(--primary-glow)'
                    }
                  : {
                      background: 'var(--surface)',
                      border: '1.5px solid var(--border)',
                      color: 'var(--text-2)'
                    }
              }
            >
              {num}
            </button>
          ))}

          {/* Next page */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-2)'
            }}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
