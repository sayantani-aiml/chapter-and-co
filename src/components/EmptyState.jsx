import React from 'react';
import { BookOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No books found',
  description = 'Your shelves are waiting for your next quiet companion.',
  actionText = null,
  onAction = null,
  icon: Icon = BookOpen
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        backgroundColor: 'rgba(250, 247, 242, 0.7)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border-warm)',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-antique-paper)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          color: 'var(--color-terracotta)',
          border: '1px solid var(--color-border-warm)'
        }}
      >
        <Icon size={26} strokeWidth={1.5} />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.45rem',
          color: 'var(--color-espresso)',
          marginBottom: '0.45rem'
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.92rem',
          color: 'var(--color-ink-muted)',
          maxWidth: '380px',
          margin: '0 auto 1.5rem',
          lineHeight: 1.5
        }}
      >
        {description}
      </p>

      {actionText && onAction && (
        <button type="button" onClick={onAction} className="btn-secondary">
          {actionText}
        </button>
      )}
    </div>
  );
}
