import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import BookCover from './BookCover';
import ProgressBar from './ProgressBar';
import { Star, BookOpen, Clock, Check, MoreVertical } from 'lucide-react';

const STATUS_LABELS = {
  'currently-reading': 'Reading',
  'completed': 'Finished',
  'want-to-read': 'Want to Read',
  'on-hold': 'On Hold',
  'abandoned': 'Abandoned'
};

export default function BookCard({ book, viewMode = 'grid' }) {
  const { setSelectedBook, setIsLogSessionModalOpen, setSessionTargetBook } = useLibrary();

  const handleOpenDetail = () => {
    setSelectedBook(book);
  };

  const handleLogQuick = (e) => {
    e.stopPropagation();
    setSessionTargetBook(book);
    setIsLogSessionModalOpen(true);
  };

  const renderStars = (rating) => {
    if (!rating || rating <= 0) return null;
    return (
      <div className="star-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={star <= Math.round(rating) ? 'star-filled' : 'star-empty'}
          />
        ))}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div
        className="paper-card book-card-list"
        onClick={handleOpenDetail}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1rem 1.25rem',
          marginBottom: '0.85rem',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-subtle)',
          transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-paper-lg)';
          e.currentTarget.style.borderColor = 'var(--color-border-warm)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-paper)';
          e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
        }}
      >
        {/* Thumbnail Cover */}
        <div style={{ width: '54px', flexShrink: 0 }}>
          <BookCover
            coverUrl={book.coverUrl}
            title={book.title}
            author={book.author}
            genre={book.genre}
          />
        </div>

        {/* Title & Author */}
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className={`book-badge status-${book.status}`}>
              {STATUS_LABELS[book.status] || book.status}
            </span>
            {book.genre && <span className="book-badge genre-badge">{book.genre}</span>}
          </div>
          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--color-espresso)',
              margin: '0 0 0.15rem 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {book.title}
          </h4>
          <p
            style={{
              fontStyle: 'italic',
              fontSize: '0.85rem',
              color: 'var(--color-ink-muted)',
              margin: 0
            }}
          >
            {book.author}
          </p>
        </div>

        {/* Rating */}
        <div style={{ width: '90px', flexShrink: 0, textAlign: 'center' }}>
          {renderStars(book.rating)}
        </div>

        {/* Reading Progress */}
        <div style={{ width: '180px', flexShrink: 0 }}>
          <ProgressBar
            current={book.currentPage || 0}
            total={book.totalPages || 1}
            height="5px"
            color={book.status === 'completed' ? 'var(--color-burgundy)' : 'var(--color-sage)'}
          />
        </div>

        {/* Quick Log Action */}
        <div style={{ flexShrink: 0 }}>
          {book.status === 'currently-reading' ? (
            <button
              type="button"
              onClick={handleLogQuick}
              className="btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              title="Log today's reading"
            >
              <Clock size={13} />
              Log
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenDetail}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
            >
              View
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid View (visual focus on book covers)
  return (
    <div
      className="paper-card book-card-grid"
      onClick={handleOpenDetail}
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: '#FAF7F2',
        border: '1px solid var(--color-border-subtle)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-paper-lift)';
        e.currentTarget.style.borderColor = 'var(--color-border-warm)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-paper)';
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
      }}
    >
      {/* Book Cover Container with status badge overlay */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '0.85rem' }}>
        <BookCover
          coverUrl={book.coverUrl}
          title={book.title}
          author={book.author}
          genre={book.genre}
        />
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 2
          }}
        >
          <span className={`book-badge status-${book.status}`} style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {STATUS_LABELS[book.status] || book.status}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ minHeight: '48px', marginBottom: '0.35rem' }}>
          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.18rem',
              fontWeight: 600,
              color: 'var(--color-espresso)',
              margin: '0 0 0.15rem 0',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            title={book.title}
          >
            {book.title}
          </h4>
          <p
            style={{
              fontStyle: 'italic',
              fontSize: '0.84rem',
              color: 'var(--color-ink-muted)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {book.author}
          </p>
        </div>

        {/* Rating and Genre */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '0.35rem 0 0.65rem'
          }}
        >
          <span className="book-badge genre-badge" style={{ margin: 0 }}>
            {book.genre || 'General'}
          </span>
          {renderStars(book.rating)}
        </div>

        {/* Progress bar if reading or completed */}
        {(book.status === 'currently-reading' || book.status === 'completed') && (
          <div style={{ marginTop: 'auto', paddingTop: '0.4rem' }}>
            <ProgressBar
              current={book.currentPage || 0}
              total={book.totalPages || 1}
              height="5px"
              color={book.status === 'completed' ? 'var(--color-burgundy)' : 'var(--color-sage)'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
