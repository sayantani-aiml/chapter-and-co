import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { getTodayDateString } from '../utils/dates';
import { X, Clock, BookOpen } from 'lucide-react';

export default function LogSessionModal() {
  const {
    isLogSessionModalOpen,
    setIsLogSessionModalOpen,
    sessionTargetBook,
    setSessionTargetBook,
    books,
    logReadingSession
  } = useLibrary();

  const [selectedBookId, setSelectedBookId] = useState('');
  const [pagesRead, setPagesRead] = useState(25);
  const [minutes, setMinutes] = useState(30);
  const [sessionDate, setSessionDate] = useState(getTodayDateString());

  useEffect(() => {
    if (sessionTargetBook) {
      setSelectedBookId(sessionTargetBook.id);
    } else {
      const activeBooks = books.filter(b => b.status === 'currently-reading');
      if (activeBooks.length > 0) {
        setSelectedBookId(activeBooks[0].id);
      } else if (books.length > 0) {
        setSelectedBookId(books[0].id);
      }
    }
  }, [sessionTargetBook, books, isLogSessionModalOpen]);

  if (!isLogSessionModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookId) return;

    logReadingSession({
      bookId: selectedBookId,
      pagesRead: Number(pagesRead) || 0,
      minutes: Number(minutes) || 0,
      date: sessionDate
    });

    setIsLogSessionModalOpen(false);
    setSessionTargetBook(null);
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
      onClick={() => {
        setIsLogSessionModalOpen(false);
        setSessionTargetBook(null);
      }}
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
              <Clock size={19} color="var(--color-olive)" />
              Log a Reading Session
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
              Record the moments spent between the pages today.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLogSessionModalOpen(false);
              setSessionTargetBook(null);
            }}
            className="btn-ghost"
            style={{ padding: '0.25rem' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Book</label>
            <select
              className="form-select"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              required
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author} ({b.status.replace('-', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Pages Read</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time (Minutes)</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Session Date</label>
            <input
              type="date"
              className="form-input"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.25rem',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '1rem'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsLogSessionModalOpen(false);
                setSessionTargetBook(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Log Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
