import React, { useState, useEffect } from 'react';
import { X, Heart, Check } from 'lucide-react';

export default function FavouriteModal({ isOpen, onClose, favToEdit = null, onSave }) {
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (favToEdit) {
      setCategory(favToEdit.category || '');
      setValue(favToEdit.value || '');
      setNote(favToEdit.note || '');
      setColor(favToEdit.color || '');
    } else {
      setCategory('');
      setValue('');
      setNote('');
      setColor('');
    }
  }, [favToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim() || !value.trim()) return;

    onSave({
      id: favToEdit ? favToEdit.id : 'fav-' + Date.now(),
      category: category.trim(),
      value: value.trim(),
      note: note.trim(),
      color: color.trim() || undefined,
      icon: favToEdit?.icon || 'Heart'
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(48, 45, 41, 0.55)',
        backdropFilter: 'blur(3px)',
        animation: 'modalBackdrop 0.2s ease forwards'
      }}
      onClick={onClose}
    >
      <div
        className="paper-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--color-paper-light)',
          border: '1px solid var(--color-border-warm)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-paper-lg)',
          padding: '1.85rem',
          animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.75rem'
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.2rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Heart size={18} color="var(--color-burgundy)" />
              {favToEdit ? 'Edit Cherished Favourite' : 'Add to Favourites'}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.84rem',
                color: 'var(--color-ink-muted)',
                margin: 0
              }}
            >
              Document the little artful things that make life rich.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '0.25rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category / Question *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Favourite Book, Favourite Tea, Favourite Poem"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Favourite *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Pride and Prejudice"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Why it resonates / Personal note (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Read 4 times; brings deep solace"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Accent Colour Hex (Optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. #899581"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              {color && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: '1px solid var(--color-border-warm)',
                    flexShrink: 0
                  }}
                />
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '1rem'
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={15} />
              <span>{favToEdit ? 'Save Changes' : 'Add Favourite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
