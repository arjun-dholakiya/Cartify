import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import BasketLogo from '../ui/BasketLogo';

/* Navigation Items Definition */
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: true },
  { to: '/profile', label: 'Profile', icon: User }
];

function SidebarInner({ onClose }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  /* Logout with toast notification */
  const handleLogout = () => {
    logout();
    showToast('Logged out. See you soon! 👋', 'info');
    navigate('/login');
  };

  /* Compute user initials for avatar fallback */
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="flex flex-col h-full py-5 px-3">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background:
              'linear-gradient(135deg, var(--primary), var(--primary-mid))'
          }}
        >
          <BasketLogo size={26} />
        </div>

        <div>
          {/* Brand name — uses --sidebar-active for max contrast on both themes */}
          <span
            className="text-[18px] font-bold leading-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              letterSpacing: '-0.02em',
              color: 'var(--sidebar-active)'
            }}
          >
            Cartify
          </span>

          <p
            className="text-[10px] leading-tight mt-0.5"
            style={{ color: 'var(--sidebar-text)', opacity: 0.7 }}
          >
            Shop Smart. Live Better.
          </p>
        </div>
      </div>

      {/* Section label */}
      <p
        className="text-[9px] font-bold uppercase tracking-widest px-3 mb-2"
        style={{ color: 'var(--sidebar-text)', opacity: 0.5 }}
      >
        Navigation
      </p>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <Icon className="w-[17px] h-[17px] shrink-0" />

            <span className="flex-1 truncate">{label}</span>

            {/* Cart item count badge */}
            {badge && cartCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white min-w-[18px] text-center shrink-0"
                style={{ background: 'var(--accent)' }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card + Logout */}
      <div
        className="mt-4 pt-4"
        style={{ borderTop: '1px solid var(--sidebar-border)' }}
      >
        {/* User info */}
        <div className="flex items-center gap-2.5 px-2 mb-3 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, var(--accent), var(--accent-dark))'
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0 flex-1">
            {/* Name — max contrast */}
            <p
              className="text-[12px] font-semibold truncate leading-tight"
              style={{ color: 'var(--sidebar-active)' }}
            >
              {user?.name}
            </p>

            <p
              className="text-[10px] truncate"
              style={{ color: 'var(--sidebar-text)', opacity: 0.7 }}
            >
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full transition-colors"
          style={{ color: 'var(--sidebar-text)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
            e.currentTarget.style.background = '';
          }}
        >
          <LogOut className="w-[17px] h-[17px] shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop Sidebar — always visible on lg+ */}
      <aside
        className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 z-30"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)'
        }}
      >
        <SidebarInner />
      </aside>

      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer — slides in from left */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--sidebar-text)' }}
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>

        <SidebarInner onClose={onClose} />
      </aside>
    </>
  );
}
