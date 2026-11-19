import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you certain?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Keep',
  onConfirm,
  onCancel,
  isDestructive = true
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(48, 45, 41, 0.45)',
        backdropFilter: 'blur(3px)',
        animation: 'modalBackdrop 0.2s ease forwards'
      }}
      onClick={onCancel}
    >
      <div
        className="paper-card"
        style={{
          width: '100%',
          maxWidth: '430px',
          padding: '1.75rem',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-warm)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-paper-lg)',
          animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isDestructive ? 'var(--color-burgundy-light)' : 'var(--color-sage-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDestructive ? 'var(--color-burgundy)' : 'var(--color-olive)'
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso)' }}>
              {title}
            </h3>
          </div>
          <button onClick={onCancel} className="btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--color-ink-muted)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={onCancel} className="btn-secondary">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-primary"
            style={{
              backgroundColor: isDestructive ? '#8C3838' : 'var(--color-burgundy)',
              borderColor: isDestructive ? '#722B2B' : 'var(--color-burgundy)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
