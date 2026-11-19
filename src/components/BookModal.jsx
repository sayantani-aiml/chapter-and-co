import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { GENRE_OPTIONS } from '../data/sampleData';
import { getTodayDateString } from '../utils/dates';
import { X, Star, Image, BookOpen, Bookmark } from 'lucide-react';

const PRESET_COVERS = [
  { label: 'Leather Spine', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Antique Botanical', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dark Academia', url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80' },
  { label: 'Linen Notebook', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80' },
  { label: 'Vintage Gold', url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80' }
];

export default function BookModal({ isOpen, onClose, bookToEdit = null }) {
  const { addBook, updateBook } = useLibrary();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverUrl: '',
    genre: 'Classic Romance',
    description: '',
    totalPages: 300,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    review: '',
    dateStarted: '',
    dateFinished: '',
    tagsString: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        coverUrl: bookToEdit.coverUrl || '',
        genre: bookToEdit.genre || 'Classic Romance',
        description: bookToEdit.description || '',
        totalPages: bookToEdit.totalPages || 300,
        currentPage: bookToEdit.currentPage || 0,
        status: bookToEdit.status || 'want-to-read',
        rating: bookToEdit.rating || 0,
        review: bookToEdit.review || '',
        dateStarted: bookToEdit.dateStarted || '',
        dateFinished: bookToEdit.dateFinished || '',
        tagsString: (bookToEdit.tags || []).join(', ')
      });
    } else {
      setFormData({
        title: '',
        author: '',
        coverUrl: '',
        genre: 'Classic Romance',
        description: '',
        totalPages: 300,
        currentPage: 0,
        status: 'want-to-read',
        rating: 0,
        review: '',
        dateStarted: '',
        dateFinished: '',
        tagsString: ''
      });
    }
    setErrors({});
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a book title.';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Please enter an author name.';
    }
    const total = Number(formData.totalPages);
    const current = Number(formData.currentPage);

    if (isNaN(total) || total <= 0) {
      newErrors.totalPages = 'Total pages must be at least 1.';
    }
    if (isNaN(current) || current < 0) {
      newErrors.currentPage = 'Current page cannot be negative.';
    } else if (current > total) {
      newErrors.currentPage = 'Current page cannot exceed total pages.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const bookPayload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      coverUrl: formData.coverUrl.trim(),
      genre: formData.genre,
      description: formData.description.trim(),
      totalPages: Number(formData.totalPages),
      currentPage: Number(formData.currentPage),
      status: formData.status,
      rating: Number(formData.rating),
      review: formData.review.trim(),
      dateStarted: formData.dateStarted,
      dateFinished: formData.dateFinished,
      tags
    };

    // Auto-complete rules
    if (bookPayload.status === 'completed') {
      bookPayload.currentPage = bookPayload.totalPages;
      if (!bookPayload.dateFinished) {
        bookPayload.dateFinished = getTodayDateString();
      }
    }

    if (bookToEdit) {
      updateBook(bookToEdit.id, bookPayload);
    } else {
      addBook(bookPayload);
    }

    onClose();
  };

  const handleStatusChange = (newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === 'completed') {
      updates.currentPage = formData.totalPages;
      if (!formData.dateFinished) {
        updates.dateFinished = getTodayDateString();
      }
    } else if (newStatus === 'currently-reading' && !formData.dateStarted) {
      updates.dateStarted = getTodayDateString();
    }
    setFormData((prev) => ({ ...prev, ...updates }));
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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-warm)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-paper-lg)',
          padding: '2rem 2.25rem',
          animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.85rem'
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.25rem 0'
              }}
            >
              {bookToEdit ? 'Edit Volume' : 'Add to Your Collection'}
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
              Record the story, its cover, and your personal impressions.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            {/* Title */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Pride and Prejudice"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            {/* Author */}
            <div className="form-group">
              <label className="form-label">Author *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jane Austen"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
              {errors.author && <div className="form-error">{errors.author}</div>}
            </div>

            {/* Genre */}
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select
                className="form-select"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              >
                {GENRE_OPTIONS.filter((g) => g !== 'All Genres').map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image URL */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Cover Image URL (Optional)</label>
                <span className="form-hint">Leave blank for bespoke editorial cover</span>
              </div>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/cover.jpg"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              />

              {/* Preset Cover Suggestions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-ink-faint)' }}>Presets:</span>
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, coverUrl: preset.url })}
                    className="btn-outline"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Status */}
            <div className="form-group">
              <label className="form-label">Reading Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="want-to-read">Want to Read</option>
                <option value="currently-reading">Currently Reading</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            {/* Rating */}
            <div className="form-group">
              <label className="form-label">Your Rating (1-5)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', paddingTop: '0.4rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star === formData.rating ? 0 : star })}
                    style={{ padding: '0.2rem', color: star <= formData.rating ? '#C28B47' : 'var(--color-border-warm)' }}
                  >
                    <Star
                      size={20}
                      fill={star <= formData.rating ? '#C28B47' : 'none'}
                      stroke={star <= formData.rating ? '#C28B47' : 'var(--color-border-dark)'}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span style={{ fontSize: '0.84rem', color: 'var(--color-espresso)', marginLeft: '0.5rem', fontWeight: 600 }}>
                    {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                )}
              </div>
            </div>

            {/* Total Pages */}
            <div className="form-group">
              <label className="form-label">Total Pages *</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
              />
              {errors.totalPages && <div className="form-error">{errors.totalPages}</div>}
            </div>

            {/* Current Page */}
            <div className="form-group">
              <label className="form-label">Current Page</label>
              <input
                type="number"
                min="0"
                max={formData.totalPages}
                className="form-input"
                value={formData.currentPage}
                onChange={(e) => setFormData({ ...formData, currentPage: e.target.value })}
              />
              {errors.currentPage && <div className="form-error">{errors.currentPage}</div>}
            </div>

            {/* Date Started */}
            <div className="form-group">
              <label className="form-label">Date Started</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateStarted}
                onChange={(e) => setFormData({ ...formData, dateStarted: e.target.value })}
              />
            </div>

            {/* Date Finished */}
            <div className="form-group">
              <label className="form-label">Date Finished</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateFinished}
                onChange={(e) => setFormData({ ...formData, dateFinished: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Personal Tags (Comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Victorian, Comfort Read, Autumn TBR"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Book Synopsis / Description</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="A brief overview of the plot or themes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Personal Review */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Personal Thoughts &amp; Review</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="How did this book make you feel? What lingered after you closed it?"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.85rem',
              marginTop: '1.5rem',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '1.25rem'
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {bookToEdit ? 'Save Changes' : 'Add to Bookshelf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
