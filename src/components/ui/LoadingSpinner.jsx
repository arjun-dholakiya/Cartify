export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 28, md: 40, lg: 56 };
  const s = sizes[size] || 40;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative" style={{ width: s, height: s }}>
        <svg
          width={s}
          height={s}
          viewBox="0 0 40 40"
          fill="none"
          className="spin"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="var(--primary-light)"
            strokeWidth="4"
          />
          <path
            d="M20 4a16 16 0 0 1 16 16"
            stroke="var(--primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <div
          className="absolute inset-0 rounded-full opacity-20 pulse-glow"
          style={{ background: 'var(--primary)', filter: 'blur(6px)' }}
        />
      </div>
      {text && (
        <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
          {text}
        </p>
      )}
    </div>
  );
}
