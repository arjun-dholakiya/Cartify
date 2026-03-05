import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BasketLogo from '../components/ui/BasketLogo';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null); // { msg, code } | null
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.id]: e.target.value }));

  /* Form Submit — Authenticate user */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) {
      setError({ msg: 'Please fill in all fields.', code: 'EMPTY' });
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const user = login(form.email, form.password);
      showToast(
        `Welcome back, ${user?.name?.split(' ')[0] || 'there'}! 👋`,
        'success'
      );
      navigate('/products');
    } catch (err) {
      setError({
        msg: err.message || 'Something went wrong.',
        code: err.code || 'UNKNOWN'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)'
      }}
    >
      {/* Decorative Background Blobs */}
      <div
        className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%)',
          transform: 'translate(-30%,-30%)'
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          transform: 'translate(30%,30%)'
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xl"
            style={{
              background:
                'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
              boxShadow: '0 6px 20px rgba(5,150,105,0.4)'
            }}
          >
            <BasketLogo size={26} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-white leading-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '-0.02em'
              }}
            >
              Cartify
            </h1>
            <p
              className="text-[11px] leading-tight"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Shop Smart. Live Better.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-3xl px-6 py-6"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 48px rgba(0,0,0,0.4)'
          }}
        >
          <h2
            className="text-lg font-bold text-white mb-0.5"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome back 👋
          </h2>
          <p
            className="text-xs mb-5"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Sign in to continue to your account
          </p>

          {/* Error message */}
          {error && (
            <div
              className="flex items-start gap-2 text-xs px-3 py-2.5 rounded-xl mb-4"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5'
              }}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="flex-1">
                {error.msg}
                {error.code === 'USER_NOT_FOUND' && (
                  <>
                    {' '}
                    —{' '}
                    <Link
                      to="/register"
                      className="font-bold underline underline-offset-2"
                      style={{ color: '#fca5a5' }}
                    >
                      Register here →
                    </Link>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="new-email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all dark-input"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl outline-none transition-all dark-input"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm mt-1 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: loading
                  ? 'rgba(5,150,105,0.5)'
                  : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 100%)',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(5,150,105,0.4)'
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block spin" />{' '}
                  Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p
          className="text-center text-sm mt-4"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold"
            style={{ color: 'var(--primary-mid)' }}
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
