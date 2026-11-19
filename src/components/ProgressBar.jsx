import React from 'react';

export default function ProgressBar({
  current = 0,
  total = 100,
  percentage = null,
  showLabel = true,
  color = 'var(--color-sage)',
  height = '6px',
  className = ''
}) {
  const calculatedPercent =
    percentage !== null
      ? Math.min(100, Math.max(0, percentage))
      : total > 0
      ? Math.min(100, Math.max(0, Math.round((current / total) * 100)))
      : 0;

  return (
    <div className={`progress-bar-wrapper ${className}`} style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.35rem',
            fontSize: '0.78rem',
            color: 'var(--color-ink-muted)'
          }}
        >
          <span>
            Page <strong style={{ color: 'var(--color-espresso)' }}>{current}</strong> of{' '}
            <strong style={{ color: 'var(--color-espresso)' }}>{total}</strong>
          </span>
          <span style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>
            {calculatedPercent}%
          </span>
        </div>
      )}

      <div
        style={{
          width: '100%',
          height,
          backgroundColor: 'var(--color-antique-paper)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 1px 2px rgba(69, 55, 47, 0.1)'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${calculatedPercent}%`,
            backgroundColor: color,
            borderRadius: '999px',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
        >
          {/* Subtle sheen highlight on top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '999px'
            }}
          />
        </div>
      </div>
    </div>
  );
}
