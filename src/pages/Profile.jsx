import { useState, useRef } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.id]: '' }));
  };

  /* Photo Upload Handler */
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  /* Form Validation */
  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Min. 2 characters';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = 'Valid email required';
    if (form.password && form.password.length < 6)
      errs.password = 'Min. 6 characters';
    return errs;
  };

  /* Form Submit — Save profile and show toast */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const updates = {
        name: form.name.trim(),
        email: form.email.trim(),
        avatar
      };
      if (form.password) updates.password = form.password;
      updateProfile(updates);
      setForm((p) => ({ ...p, password: '' }));

      /* Toast replaces the in-page success banner */
      showToast('Profile updated successfully! ✅', 'success');
    } finally {
      setLoading(false);
    }
  };

  /* Compute initials for avatar fallback */
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="flex flex-col gap-5 fade-in max-w-lg w-full">
      {/* Page Header */}
      <div>
        <h1
          className="text-xl sm:text-2xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
        >
          Your Profile
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
          Manage your account details and photo
        </p>
      </div>

      {/* Avatar Card */}
      <div
        className="rounded-2xl p-4 sm:p-5 flex items-center gap-4"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
          border: '1px solid transparent'
        }}
      >
        {/* Clickable photo circle with camera overlay */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative group shrink-0"
          title="Click to change photo"
        >
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, var(--accent), var(--accent-dark))'
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-white text-xl font-bold"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {initials}
              </span>
            )}
          </div>
          {/* Camera overlay on hover */}
          <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--primary)',
              border: '2px solid #0f172a'
            }}
          >
            <Camera className="w-3 h-3 text-white" />
          </div>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        {/* User name + email */}
        <div className="min-w-0">
          <p
            className="text-base font-bold text-white truncate"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {user?.name}
          </p>
          <p
            className="text-xs truncate"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {user?.email}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-semibold mt-1.5 px-2.5 py-1 rounded-full transition-all hover:opacity-80"
            style={{
              background: 'var(--primary-glow)',
              color: 'var(--primary-mid)'
            }}
          >
            📷 Change photo
          </button>
        </div>
      </div>

      {/* Account Settings Form */}
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <h2
          className="text-sm font-bold mb-4"
          style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text)' }}
        >
          Account Settings
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-3)' }}
            >
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-3)' }}
              />
              <input
                id="name"
                placeholder="John Doe"
                autoComplete="new-name"
                value={form.name}
                onChange={handleChange}
                required
                className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {errors.name && (
              <span className="text-[11px]" style={{ color: '#ef4444' }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-3)' }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-3)' }}
              />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="new-email"
                required
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {errors.email && (
              <span className="text-[11px]" style={{ color: '#ef4444' }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* New Password Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-3)' }}
            >
              New Password{' '}
              <span className="normal-case font-normal">
                (leave blank to keep current)
              </span>
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-3)' }}
              />
              <input
                autoComplete="new-password"
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="New password"
                value={form.password}
                onChange={handleChange}
                className={`input-field pr-11 ${
                  errors.password ? 'border-red-400' : ''
                }`}
                style={{ paddingLeft: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-3)' }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-[11px]" style={{ color: '#ef4444' }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Save Changes Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 mt-1"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block spin" />{' '}
                Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
