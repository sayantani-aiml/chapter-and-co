import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import BookCover from './BookCover';
import ProgressBar from './ProgressBar';
import ConfirmModal from './ConfirmModal';
import { formatDate } from '../utils/dates';
import {
  X,
  Star,
  Edit3,
  Trash2,
  Plus,
  Quote,
  Clock,
  Feather,
  BookOpen,
  Calendar,
  CheckCircle2,
  Bookmark,
  RotateCcw
} from 'lucide-react';

export default function BookDetailModal({ book, onClose, onEdit }) {
  const {
    updateBookProgress,
    updateBook,
    deleteBook,
    addQuoteToBook,
    deleteQuoteFromBook,
    addRereadToBook,
    deleteRereadFromBook,
    setIsLogSessionModalOpen,
    setSessionTargetBook,
    setActiveTab
  } = useLibrary();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAddingQuote, setIsAddingQuote] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuotePage, setNewQuotePage] = useState('');
  const [newQuoteNote, setNewQuoteNote] = useState('');

  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewDraft, setReviewDraft] = useState(book?.review || '');

  // Reread form state
  const [isAddingReread, setIsAddingReread] = useState(false);
  const [rereadStartDate, setRereadStartDate] = useState('');
  const [rereadFinishDate, setRereadFinishDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rereadRating, setRereadRating] = useState(0);
  const [rereadNote, setRereadNote] = useState('');

  if (!book) return null;

  const current = book.currentPage || 0;
  const total = book.totalPages || 1;
  const percentage = Math.min(100, Math.round((current / total) * 100));

  const handlePageSliderChange = (e) => {
    const val = Number(e.target.value);
    updateBookProgress(book.id, val);
  };

  const handleStatusChange = (newStatus) => {
    updateBook(book.id, { status: newStatus });
  };

  const handleSaveReview = () => {
    updateBook(book.id, { review: reviewDraft.trim() });
    setIsEditingReview(false);
  };

  const handleAddRereadSubmit = (e) => {
    e.preventDefault();
    addRereadToBook(book.id, {
      startDate: rereadStartDate,
      finishDate: rereadFinishDate || new Date().toISOString().slice(0, 10),
      rating: rereadRating,
      note: rereadNote.trim()
    });
    setRereadStartDate('');
    setRereadFinishDate(new Date().toISOString().slice(0, 10));
    setRereadRating(0);
    setRereadNote('');
    setIsAddingReread(false);
  };

  const handleAddQuoteSubmit = (e) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;
    addQuoteToBook(book.id, {
      text: newQuoteText.trim(),
      page: newQuotePage,
      note: newQuoteNote.trim()
    });
    setNewQuoteText('');
    setNewQuotePage('');
    setNewQuoteNote('');
    setIsAddingQuote(false);
  };

  const handleDeleteBookConfirmed = () => {
    deleteBook(book.id);
    setIsDeleteConfirmOpen(false);
    onClose();
  };

  const handleOpenSessionModal = () => {
    setSessionTargetBook(book);
    setIsLogSessionModalOpen(true);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 950,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backgroundColor: 'rgba(48, 45, 41, 0.55)',
          backdropFilter: 'blur(4px)',
          animation: 'modalBackdrop 0.2s ease forwards'
        }}
        onClick={onClose}
      >
        <div
          className="paper-card"
          style={{
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-warm)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-paper-lg)',
            padding: '2.25rem',
            animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Controls: Close & Edit & Delete */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span className={`book-badge status-${book.status}`}>
                {book.status.replace('-', ' ')}
              </span>
              {book.genre && <span className="book-badge genre-badge">{book.genre}</span>}
              {book.series?.name && (
                <span
                  className="book-badge"
                  style={{
                    backgroundColor: 'var(--color-antique-paper)',
                    color: 'var(--color-burgundy)',
                    borderColor: 'var(--color-border-warm)'
                  }}
                >
                  Series: {book.series.name} #{book.series.number || 1}{book.series.total ? ` of ${book.series.total}` : ''}
                </span>
              )}
              {Array.isArray(book.shelves) && book.shelves.map((shelf) => (
                <span
                  key={shelf}
                  className="book-badge"
                  style={{
                    backgroundColor: 'var(--color-parchment)',
                    borderColor: 'var(--color-border-warm)',
                    color: 'var(--color-espresso)'
                  }}
                >
                  📁 {shelf}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(book);
                }}
                className="btn-ghost"
                title="Edit volume details"
              >
                <Edit3 size={17} />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="btn-ghost"
                style={{ color: '#8C3838' }}
                title="Remove book from library"
              >
                <Trash2 size={17} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
                style={{ padding: '0.35rem', marginLeft: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Hero Section: Cover Left, Details Right */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: '2rem',
              alignItems: 'start',
              marginBottom: '2rem'
            }}
            className="book-detail-hero"
          >
            {/* Left Cover & Quick Reading Progress */}
            <div>
              <div style={{ width: '100%', marginBottom: '1.25rem' }}>
                <BookCover
                  coverUrl={book.coverUrl}
                  title={book.title}
                  author={book.author}
                  genre={book.genre}
                />
              </div>

              {/* Progress Slider */}
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-warm)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '0.4rem'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-espresso-light)' }}>
                    Reading Progress
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>
                    {percentage}%
                  </span>
                </div>

                <ProgressBar
                  current={current}
                  total={total}
                  showLabel={false}
                  height="7px"
                  color={book.status === 'completed' ? 'var(--color-burgundy)' : 'var(--color-sage)'}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.65rem'
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-espresso)' }}>
                    Page <strong>{current}</strong> of <strong>{total}</strong>
                  </span>
                </div>

                {/* Slider input */}
                <input
                  type="range"
                  min="0"
                  max={total}
                  value={current}
                  onChange={handlePageSliderChange}
                  style={{
                    width: '100%',
                    marginTop: '0.65rem',
                    accentColor: 'var(--color-burgundy)',
                    cursor: 'pointer'
                  }}
                />

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleOpenSessionModal}
                    className="btn-outline"
                    style={{ width: '100%', fontSize: '0.76rem', padding: '0.35rem 0.5rem' }}
                  >
                    <Clock size={13} />
                    Log Session
                  </button>
                  {book.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => updateBookProgress(book.id, total)}
                      className="btn-outline"
                      style={{ fontSize: '0.76rem', padding: '0.35rem 0.5rem', whiteSpace: 'nowrap' }}
                      title="Mark as finished"
                    >
                      <CheckCircle2 size={13} color="var(--color-olive)" />
                      Finish
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Information */}
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.2rem',
                  lineHeight: 1.15,
                  fontWeight: 700,
                  color: 'var(--color-espresso)',
                  margin: '0 0 0.35rem 0'
                }}
              >
                {book.title}
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  color: 'var(--color-ink-muted)',
                  margin: '0 0 1rem 0'
                }}
              >
                by {book.author}
              </p>

              {/* Star Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= Math.round(book.rating || 0) ? '#C28B47' : 'none'}
                      stroke={star <= Math.round(book.rating || 0) ? '#C28B47' : 'var(--color-border-warm)'}
                    />
                  ))}
                </div>
                {book.rating > 0 && (
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                    {book.rating} / 5
                  </span>
                )}
              </div>

              {/* Meta tags & Dates */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--color-border-warm)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                  color: 'var(--color-ink-muted)'
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-ink-muted)', marginRight: '0.35rem' }}>Length:</span>
                  <strong style={{ color: 'var(--color-espresso)' }}>{total} pages</strong>
                </div>

                {book.dateStarted && (
                  <div>
                    <span style={{ color: 'var(--color-ink-muted)', marginRight: '0.35rem' }}>Started:</span>
                    <strong style={{ color: 'var(--color-espresso)' }}>{formatDate(book.dateStarted)}</strong>
                  </div>
                )}

                {book.dateFinished && (
                  <div>
                    <span style={{ color: 'var(--color-ink-muted)', marginRight: '0.35rem' }}>Finished:</span>
                    <strong style={{ color: 'var(--color-espresso)' }}>{formatDate(book.dateFinished)}</strong>
                  </div>
                )}
              </div>

              {/* Tags */}
              {book.tags && book.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.74rem',
                        backgroundColor: 'var(--color-antique-paper)',
                        color: 'var(--color-espresso)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        border: '1px solid var(--color-border-subtle)'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.05rem',
                      color: 'var(--color-espresso)',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Synopsis
                  </h4>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-ink-muted)', margin: 0 }}>
                    {book.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ornamental Divider */}
          <div className="ornamental-divider">
            <span className="ornamental-divider-motif">❦</span>
          </div>

          {/* My Thoughts & Personal Review Section */}
          <section style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--color-espresso)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Feather size={18} color="var(--color-burgundy)" />
                My Thoughts &amp; Impressions
              </h3>

              {!isEditingReview && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewDraft(book.review || '');
                    setIsEditingReview(true);
                  }}
                  className="btn-outline"
                  style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                >
                  <Edit3 size={13} />
                  {book.review ? 'Edit Thoughts' : 'Write Thoughts'}
                </button>
              )}
            </div>

            {isEditingReview ? (
              <div style={{ backgroundColor: 'var(--color-antique-paper)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-warm)' }}>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={reviewDraft}
                  onChange={(e) => setReviewDraft(e.target.value)}
                  placeholder="Record your personal impressions, memorable dialogue, and emotional takeaways..."
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.65rem' }}>
                  <button type="button" onClick={() => setIsEditingReview(false)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleSaveReview} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    Save Thoughts
                  </button>
                </div>
              </div>
            ) : book.review ? (
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: 'var(--color-espresso)',
                  backgroundColor: 'var(--bg-muted)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--color-burgundy)',
                  fontStyle: 'italic'
                }}
              >
                "{book.review}"
              </div>
            ) : (
              <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-faint)', fontStyle: 'italic' }}>
                No review written yet. Jot down your reflections as you turn the pages.
              </p>
            )}
          </section>

          {/* Ornamental Divider */}
          <div className="ornamental-divider">
            <span className="ornamental-divider-motif">❦</span>
          </div>

          {/* Read-Through History Section */}
          <section style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--color-espresso)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <RotateCcw size={18} color="var(--color-burgundy)" />
                Read-Through History ({1 + (book.rereads ? book.rereads.length : 0)})
              </h3>

              {!isAddingReread && (
                <button
                  type="button"
                  onClick={() => setIsAddingReread(true)}
                  className="btn-outline"
                  style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                >
                  <Plus size={13} />
                  Log Reread
                </button>
              )}
            </div>

            {/* Log Reread Subform */}
            {isAddingReread && (
              <form
                onSubmit={handleAddRereadSubmit}
                style={{
                  backgroundColor: 'var(--color-antique-paper)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-warm)',
                  marginBottom: '1.25rem'
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-espresso)', margin: '0 0 0.85rem' }}>
                  Log a New Read-Through
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={rereadStartDate}
                      onChange={(e) => setRereadStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Finish Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={rereadFinishDate}
                      onChange={(e) => setRereadFinishDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Rating */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Reread Rating (Optional)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRereadRating(star === rereadRating ? 0 : star)}
                        style={{ padding: '0.2rem', color: star <= rereadRating ? '#C28B47' : 'var(--color-border-warm)' }}
                      >
                        <Star
                          size={18}
                          fill={star <= rereadRating ? '#C28B47' : 'none'}
                          stroke={star <= rereadRating ? '#C28B47' : 'var(--color-border-dark)'}
                        />
                      </button>
                    ))}
                    {rereadRating > 0 && (
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-espresso)', marginLeft: '0.4rem', fontWeight: 600 }}>
                        {rereadRating} Star{rereadRating === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Note */}
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Reread Notes / Reflections (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Loved it even more the second time; noticed subtle foreshadowing..."
                    value={rereadNote}
                    onChange={(e) => setRereadNote(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingReread(false)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    Save Reread
                  </button>
                </div>
              </form>
            )}

            {/* Read-through List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Original Reading */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.15rem',
                  backgroundColor: 'var(--color-paper-light)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-espresso)' }}>
                      1st Read-Through (Original)
                    </span>
                    {book.rating > 0 && (
                      <span style={{ fontSize: '0.76rem', color: '#C28B47', fontWeight: 600 }}>
                        ★ {book.rating}/5
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                    {book.dateStarted ? `Started ${formatDate(book.dateStarted)}` : 'Start unrecorded'}
                    {book.dateFinished ? ` · Finished ${formatDate(book.dateFinished)}` : (book.status === 'completed' ? ' · Finished' : ' · In Progress')}
                  </div>
                </div>
                <span className="book-badge" style={{ backgroundColor: 'var(--color-antique-paper)', fontSize: '0.72rem' }}>
                  Original
                </span>
              </div>

              {/* Rereads */}
              {Array.isArray(book.rereads) && book.rereads.map((reread, idx) => (
                <div
                  key={reread.id || idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1.15rem',
                    backgroundColor: 'var(--color-paper-light)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-espresso)' }}>
                        Reread #{book.rereads.length - idx}
                      </span>
                      {reread.rating > 0 && (
                        <span style={{ fontSize: '0.76rem', color: '#C28B47', fontWeight: 600 }}>
                          ★ {reread.rating}/5
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                      {reread.startDate ? `Started ${formatDate(reread.startDate)} · ` : ''}
                      Finished {formatDate(reread.finishDate)}
                    </div>
                    {reread.note && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-espresso)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        "{reread.note}"
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteRereadFromBook(book.id, reread.id)}
                    className="btn-ghost"
                    style={{ padding: '0.3rem', color: 'var(--color-ink-faint)' }}
                    title="Remove reread entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Ornamental Divider */}
          <div className="ornamental-divider">
            <span className="ornamental-divider-motif">❦</span>
          </div>

          {/* Favourite Quotes Section */}
          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--color-espresso)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Quote size={18} color="var(--color-terracotta)" />
                Favourite Quotes ({book.quotes ? book.quotes.length : 0})
              </h3>

              {!isAddingQuote && (
                <button
                  type="button"
                  onClick={() => setIsAddingQuote(true)}
                  className="btn-outline"
                  style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                >
                  <Plus size={13} />
                  Add Quote
                </button>
              )}
            </div>

            {/* Add Quote Subform */}
            {isAddingQuote && (
              <form
                onSubmit={handleAddQuoteSubmit}
                style={{
                  backgroundColor: 'var(--color-antique-paper)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-warm)',
                  marginBottom: '1.25rem'
                }}
              >
                <div className="form-group">
                  <label className="form-label">Quote Text *</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Enter the passage that moved you..."
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Page No.</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 142"
                      value={newQuotePage}
                      onChange={(e) => setNewQuotePage(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Personal Reflection (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Why did this passage resonate?"
                      value={newQuoteNote}
                      onChange={(e) => setNewQuoteNote(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingQuote(false)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    Save Keepsake
                  </button>
                </div>
              </form>
            )}

            {/* List of quotes */}
            {book.quotes && book.quotes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {book.quotes.map((q) => (
                    <div
                      key={q.id}
                      className="paper-card"
                      style={{
                        padding: '1.15rem 1.4rem',
                        backgroundColor: 'var(--color-paper-light)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        position: 'relative'
                      }}
                    >
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.08rem',
                        lineHeight: 1.55,
                        color: 'var(--color-espresso)',
                        fontStyle: 'italic',
                        margin: '0 0 0.5rem 0'
                      }}
                    >
                      "{q.text}"
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.78rem',
                        color: 'var(--color-ink-muted)'
                      }}
                    >
                      <div>
                        {q.page && <span style={{ marginRight: '0.75rem' }}>Page {q.page}</span>}
                        {q.note && (
                          <span style={{ color: 'var(--color-terracotta)', fontStyle: 'italic' }}>
                            — Note: {q.note}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteQuoteFromBook(book.id, q.id)}
                        className="btn-ghost"
                        style={{ padding: '0.2rem', color: 'var(--color-ink-faint)' }}
                        title="Delete quote"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingQuote && (
                <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-faint)', fontStyle: 'italic' }}>
                  No quotes saved from this book yet. Press "Add Quote" above to immortalize a line.
                </p>
              )
            )}
          </section>
        </div>
      </div>

      {/* Confirmation Dialog for Deleting Book */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Remove this Volume?"
        message={`Are you certain you wish to delete "${book.title}"? All associated quotes and logged pages for this title will be removed.`}
        confirmText="Delete Book"
        cancelText="Keep Book"
        onConfirm={handleDeleteBookConfirmed}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />

      <style>{`
        @media (max-width: 650px) {
          .book-detail-hero {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
