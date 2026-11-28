import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { MOOD_OPTIONS } from '../data/sampleData';
import { getTodayDateString } from '../utils/dates';
import { X, Feather } from 'lucide-react';

export default function JournalModal({ isOpen, onClose, entryToEdit = null }) {
  const { addJournalEntry, updateJournalEntry, books } = useLibrary();

  const [formData, setFormData] = useState({
    title: '',
    date: getTodayDateString(),
    bookId: '',
    mood: 'Cozy',
    content: '',
    tagsString: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entryToEdit) {
      setFormData({
        title: entryToEdit.title || '',
        date: entryToEdit.date || getTodayDateString(),
        bookId: entryToEdit.bookId || '',
        mood: entryToEdit.mood || 'Cozy',
        content: entryToEdit.content || '',
        tagsString: (entryToEdit.tags || []).join(', ')
      });
    } else {
      setFormData({
        title: '',
        date: getTodayDateString(),
        bookId: '',
        mood: 'Cozy',
        content: '',
        tagsString: ''
      });
    }
    setErrors({});
  }, [entryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Please provide a title for your entry.' });
      return;
    }
    if (!formData.content.trim()) {
      setErrors({ content: 'Please write your journal entry thoughts.' });
      return;
    }

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      date: formData.date,
      bookId: formData.bookId || null,
      mood: formData.mood,
      content: formData.content.trim(),
      tags
    };

    if (entryToEdit) {
      updateJournalEntry(entryToEdit.id, payload);
    } else {
      addJournalEntry(payload);
    }

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        backgroundColor: 'rgba(48, 45, 41, 0.5)',
        backdropFilter: 'blur(3px)',
        animation: 'modalBackdrop 0.2s ease forwards'
      }}
      onClick={onClose}
    >
      <div
        className="paper-card"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--color-paper-light)',
          border: '1px solid var(--color-border-warm)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-paper-lg)',
          padding: '2rem 2.25rem',
          animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.75rem'
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.2rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Feather size={22} color="var(--color-burgundy)" />
              {entryToEdit ? 'Edit Journal Entry' : 'New Reading Journal Entry'}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.88rem',
                color: 'var(--color-ink-muted)',
                margin: 0
              }}
            >
              A quiet sanctuary for your musings, atmospheres, and bookish moments.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Entry Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Autumn rain against the bay window & Jane Eyre"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Associated Book (Optional)</label>
              <select
                className="form-select"
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
              >
                <option value="">None / General Thoughts</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.author})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="form-group">
            <label className="form-label">Mood of this Reading Session</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.3rem' }}>
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = formData.mood === mood.label;
                return (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: mood.label })}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      border: isSelected
                        ? `1.5px solid ${mood.color}`
                        : '1px solid var(--color-border-warm)',
                      backgroundColor: isSelected ? mood.bg : 'var(--color-paper-card)',
                      color: isSelected ? mood.color : 'var(--color-ink-muted)',
                      boxShadow: isSelected ? 'var(--shadow-paper-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {mood.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">Journal Reflections *</label>
            <textarea
              className="form-textarea"
              rows="6"
              placeholder="What did you feel as you read? Describe the surroundings, your tea or coffee, the questions the book stirred in you..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            {errors.content && <div className="form-error">{errors.content}</div>}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Rainy Day, Tea Time, Gothic Atmosphere"
              value={formData.tagsString}
              onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '1.25rem'
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {entryToEdit ? 'Save Changes' : 'Pen Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
