import { useState, useRef, useEffect } from 'react';
import { Menu, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import BasketLogo from '../ui/BasketLogo';

/* ─── Navbar ───────────────────────────────────────────────────
   Top navigation bar — fixed, sits above main content on all
   screen sizes. Offset by sidebar width (lg:left-60).
   Contains: hamburger (mobile), mobile logo, session timer,
   cart pill, dark mode toggle, and user dropdown.
──────────────────────────────────────────────────────────────── */
export default function Navbar({ onMenuClick }) {
  const { user, sessionSeconds, formatTimer, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ── Click-outside: close dropdown when user clicks anywhere outside ──
     Using 'mousedown' so it fires BEFORE 'click', preventing the
     race condition that caused double-click on trackpads with onBlur. */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const timerWarning = sessionSeconds < 300;

  /* Compute user initials for avatar fallback */
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:left-60 h-14 z-20 flex items-center px-3 sm:px-5 gap-2"
      style={{
        background: 'rgba(240,253,248,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* ── Hamburger — mobile only ── */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl transition-colors shrink-0"
        style={{ color: 'var(--text-2)' }}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile logo — hidden on desktop (sidebar shows logo) ── */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 lg:hidden shrink-0"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background:
              'linear-gradient(135deg, var(--primary), var(--primary-mid))'
          }}
        >
          <BasketLogo size={18} />
        </div>
        <span
          className="font-bold text-base"
          style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
        >
          Cartify
        </span>
      </Link>

      {/* Spacer — pushes right group to far right */}
      <div className="flex-1" />

      {/* ── Right group ── */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Session timer — shows in red when < 5 min */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl shrink-0"
          style={
            timerWarning
              ? {
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca'
                }
              : {
                  background: 'var(--surface)',
                  color: 'var(--text-2)',
                  border: '1px solid var(--border)'
                }
          }
        >
          {timerWarning ? '⚠️' : '⏱'} {formatTimer()}
        </div>

        {/* Cart pill — only visible when cart has items */}
        {cartCount > 0 && (
          <Link
            to="/cart"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 shrink-0"
            style={{
              background: 'var(--accent-light)',
              color: 'var(--accent-dark)'
            }}
          >
            🛒 {cartCount > 99 ? '99+' : cartCount}
          </Link>
        )}

        {/* ── Dark / Light mode toggle ── */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-105 shrink-0"
          style={{
            background: isDark ? 'rgba(245,158,11,0.12)' : 'var(--surface)',
            border: '1px solid var(--border)',
            color: isDark ? 'var(--accent)' : 'var(--text-2)'
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Divider */}
        <div
          className="hidden sm:block w-px h-5 mx-1 shrink-0"
          style={{ background: 'var(--border)' }}
        />

        {/* ── User dropdown ── */}
        {/* ref on the container so click-outside ignores clicks inside */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors cursor-pointer hover:bg-white/70"
          >
            {/* Avatar — shows photo if set, else initials */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, var(--primary), var(--primary-mid))'
              }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* Name (hidden on very small screens) */}
            <div className="hidden sm:block text-left min-w-0">
              <p
                className="text-xs font-bold leading-none max-w-[90px] truncate"
                style={{ color: 'var(--text)' }}
              >
                {user?.name?.split(' ')[0]}
              </p>
              <p
                className="text-[10px] leading-none mt-0.5"
                style={{ color: 'var(--text-3)' }}
              >
                Member
              </p>
            </div>
            <span
              className="hidden sm:block text-xs"
              style={{ color: 'var(--text-3)' }}
            >
              ▾
            </span>
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-2xl py-2 z-50 fade-in-fast"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.14)'
              }}
            >
              {/* User info header */}
              <div
                className="px-4 py-2"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: 'var(--text)' }}
                >
                  {user?.name}
                </p>
                <p
                  className="text-[11px] truncate"
                  style={{ color: 'var(--text-3)' }}
                >
                  {user?.email}
                </p>
              </div>

              {/* Account settings link */}
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50"
                style={{ color: 'var(--text-2)' }}
              >
                <Settings className="w-3.5 h-3.5 shrink-0" /> Account Settings
              </Link>

              {/* Cart link */}
              <Link
                to="/cart"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50"
                style={{ color: 'var(--text-2)' }}
              >
                🛒 My Cart
                {cartCount > 0 && (
                  <span
                    className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Logout */}
              <div
                style={{ borderTop: '1px solid var(--border)' }}
                className="mt-1 pt-1"
              >
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-red-50"
                  style={{ color: '#ef4444' }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
