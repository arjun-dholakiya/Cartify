export default function StatsCard({
  icon: Icon,
  label,
  value,
  color = 'emerald',
  trend
}) {
  const palettes = {
    emerald: {
      bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
      icon: '#059669',
      text: '#065f46'
    },
    amber: {
      bg: 'linear-gradient(135deg,#fef3c7,#fde68a)',
      icon: '#d97706',
      text: '#92400e'
    },
    rose: {
      bg: 'linear-gradient(135deg,#ffe4e6,#fecdd3)',
      icon: '#e11d48',
      text: '#9f1239'
    },
    violet: {
      bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
      icon: '#7c3aed',
      text: '#4c1d95'
    },
    teal: {
      bg: 'linear-gradient(135deg,#ccfbf1,#99f6e4)',
      icon: '#0d9488',
      text: '#134e4a'
    },
    orange: {
      bg: 'linear-gradient(135deg,#ffedd5,#fed7aa)',
      icon: '#ea580c',
      text: '#9a3412'
    }
  };

  const p = palettes[color] || palettes.emerald;

  return (
    <div className="stats-card group flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 hover:scale-[1.02] transition-all duration-300 cursor-default text-center sm:text-left">
      {/* Icon */}
      <div
        className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{ background: p.bg }}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: p.icon }} />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0 flex-1 items-center sm:items-start">
        <p
          className="text-[10px] sm:text-xs font-medium truncate"
          style={{ color: 'var(--text-2)' }}
        >
          {label}
        </p>

        <p
          className="text-lg sm:text-2xl font-bold leading-tight wrap-break-word"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: 'var(--text)'
          }}
        >
          {value}
        </p>

        {trend && (
          <p
            className="text-[10px] sm:text-[11px] font-medium mt-0.5 wrap-break-word"
            style={{ color: p.text }}
          >
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
