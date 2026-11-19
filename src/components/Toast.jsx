import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useLibrary();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        maxWidth: '380px',
        width: 'calc(100vw - 3rem)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: '#FAF7F2',
              border: `1px solid ${isError ? '#D89797' : 'var(--color-border-warm)'}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-paper-lg)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              color: 'var(--color-espresso)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {isError ? (
                <AlertCircle size={18} color="#A33232" style={{ flexShrink: 0 }} />
              ) : isInfo ? (
                <Info size={18} color="var(--color-sage)" style={{ flexShrink: 0 }} />
              ) : (
                <CheckCircle2 size={18} color="var(--color-olive)" style={{ flexShrink: 0 }} />
              )}
              <span style={{ lineHeight: 1.4 }}>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'var(--color-ink-muted)',
                padding: '0.2rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
