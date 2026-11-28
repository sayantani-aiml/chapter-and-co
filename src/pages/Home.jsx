import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import BookCover from '../components/BookCover';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import {
  formatEditorialDate,
  getGreeting,
  formatDate
} from '../utils/dates';
import {
  calculateReadingStreak,
  calculatePace
} from '../utils/statistics';
import { LITERARY_QUOTES_INSPIRATION } from '../data/sampleData';
import {
  BookOpen,
  CheckCircle,
  Flame,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  Quote,
  Star,
  RefreshCw,
  Plus,
  Check
} from 'lucide-react';

export default function Home() {
  const {
    books,
    sessions,
    goal,
    setActiveTab,
    setSelectedBook,
    setIsLogSessionModalOpen,
    setSessionTargetBook,
    setIsAddBookModalOpen
  } = useLibrary();

  // Pick a featured inspiration quote
  const [quoteIndex, setQuoteIndex] = useState(0);

  const greeting = getGreeting();
  const currentDate = formatEditorialDate();

  // Books calculations
  const currentlyReadingBooks = books.filter((b) => b.status === 'currently-reading');
  const completedBooks = books.filter((b) => b.status === 'completed');
  const wantToReadBooks = books.filter((b) => b.status === 'want-to-read');

  const currentYear = new Date().getFullYear();
  const completedThisYear = completedBooks.filter((b) => {
    if (!b.dateFinished) return true;
    return new Date(b.dateFinished).getFullYear() === currentYear;
  }).length;

  // Recently finished books, sorted chronologically by completion date
  const recentlyFinishedBooks = [...completedBooks]
    .sort((a, b) => {
      const dateA = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
      const dateB = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 4);

  const streak = calculateReadingStreak(sessions);
  const goalPercent = Math.min(100, Math.round((completedThisYear / (goal || 1)) * 100));
  const pace = calculatePace(completedThisYear, goal);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % LITERARY_QUOTES_INSPIRATION.length);
  };

  const featuredQuote = LITERARY_QUOTES_INSPIRATION[quoteIndex];

  // Pick a book from want-to-read as a recommendation
  const recommendedBook = wantToReadBooks.length > 0 ? wantToReadBooks[0] : null;

  return (
    <div className="home-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* 1. Welcome Header Section */}
      <section
        style={{
          borderBottom: '1px solid var(--color-border-warm)',
          paddingBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-terracotta)',
              fontWeight: 600,
              marginBottom: '0.35rem'
            }}
          >
            {currentDate}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              fontWeight: 600,
              color: 'var(--color-espresso)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.4rem 0'
            }}
          >
            {greeting}, book lover.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              color: 'var(--color-ink-muted)',
              margin: 0
            }}
          >
            Every story you read becomes a part of your story.
          </p>
        </div>

        {/* Featured Literary Epigraph */}
        <div
          className="paper-card"
          style={{
            maxWidth: '430px',
            padding: '1.1rem 1.4rem',
            backgroundColor: '#FAF7F2',
            border: '1px solid var(--color-border-warm)',
            borderRadius: 'var(--radius-md)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-burgundy)', fontWeight: 600 }}>
              Daily Epigraph
            </span>
            <button
              type="button"
              onClick={nextQuote}
              className="btn-ghost"
              style={{ padding: '0.2rem', color: 'var(--color-ink-faint)' }}
              title="Next literary quote"
            >
              <RefreshCw size={13} />
            </button>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '0.98rem',
              lineHeight: 1.45,
              color: 'var(--color-espresso)',
              margin: '0 0 0.35rem 0'
            }}
          >
            "{featuredQuote.quote}"
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', fontStyle: 'normal' }}>
            — {featuredQuote.author}
          </span>
        </div>
      </section>

      {/* 2. Reading Overview (4 Editorial Summary Blocks) */}
      <section>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {/* Block 1: Books Completed */}
          <div
            className="paper-card"
            style={{
              padding: '1.35rem 1.4rem',
              backgroundColor: 'var(--color-paper-light)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                Books Finished
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-burgundy-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-burgundy)'
                }}
              >
                <CheckCircle size={15} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-espresso)', lineHeight: 1 }}>
                {completedThisYear}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                this year ({completedBooks.length} all-time)
              </span>
            </div>

            <ProgressBar
              current={completedThisYear}
              total={goal}
              showLabel={false}
              height="4px"
              color="var(--color-burgundy)"
            />
          </div>

          {/* Block 2: Currently Reading */}
          <div
            className="paper-card"
            style={{
              padding: '1.35rem 1.4rem',
              backgroundColor: 'var(--color-paper-light)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('bookshelf')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                Currently Reading
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-sage-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-olive)'
                }}
              >
                <BookOpen size={15} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-espresso)', lineHeight: 1 }}>
                {currentlyReadingBooks.length}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                {currentlyReadingBooks.length === 1 ? 'volume open' : 'volumes open'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-olive)', fontWeight: 500 }}>
              On your nightstand &amp; tote
            </div>
          </div>

          {/* Block 3: Reading Goal */}
          <div
            className="paper-card"
            style={{
              padding: '1.35rem 1.4rem',
              backgroundColor: 'var(--color-paper-light)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('goals')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                Annual Goal
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-terracotta-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-terracotta)'
                }}
              >
                <Target size={15} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-espresso)', lineHeight: 1 }}>
                {goalPercent}%
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                ({completedThisYear} / {goal} books)
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
              {pace.status}
            </div>
          </div>

          {/* Block 4: Reading Streak */}
          <div
            className="paper-card"
            style={{
              padding: '1.35rem 1.4rem',
              backgroundColor: 'var(--color-paper-light)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
                Reading Streak
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-amber-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-amber)'
                }}
              >
                <Flame size={15} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-espresso)', lineHeight: 1 }}>
                {streak}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                {streak === 1 ? 'day' : 'days in a row'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
              {streak > 0 ? 'Quiet daily sanctuary kept' : 'Log a session to begin today'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Continue Reading: Currently on your Nightstand */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.2rem 0'
              }}
            >
              Currently on your nightstand
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: 0 }}>
              The worlds you are currently stepping into each evening.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSessionTargetBook(currentlyReadingBooks[0] || null);
              setIsLogSessionModalOpen(true);
            }}
            className="btn-outline"
            style={{ fontSize: '0.82rem' }}
          >
            <Clock size={14} />
            Log Reading Today
          </button>
        </div>

        {currentlyReadingBooks.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {currentlyReadingBooks.map((book) => {
              const current = book.currentPage || 0;
              const total = book.totalPages || 1;
              const pct = Math.min(100, Math.round((current / total) * 100));

              return (
                <div
                  key={book.id}
                  className="paper-card"
                  style={{
                    display: 'flex',
                    gap: '1.35rem',
                    padding: '1.35rem',
                    backgroundColor: '#FAF7F2',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  {/* Cover */}
                  <div
                    style={{ width: '100px', flexShrink: 0, cursor: 'pointer' }}
                    onClick={() => setSelectedBook(book)}
                  >
                    <BookCover
                      coverUrl={book.coverUrl}
                      title={book.title}
                      author={book.author}
                      genre={book.genre}
                    />
                  </div>

                  {/* Info & Progress */}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span className="book-badge genre-badge" style={{ marginBottom: '0.35rem' }}>
                        {book.genre}
                      </span>
                      <h3
                        onClick={() => setSelectedBook(book)}
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.35rem',
                          fontWeight: 600,
                          color: 'var(--color-espresso)',
                          margin: '0 0 0.15rem 0',
                          lineHeight: 1.25,
                          cursor: 'pointer'
                        }}
                      >
                        {book.title}
                      </h3>
                      <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--color-ink-muted)', margin: 0 }}>
                        {book.author}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: 'auto', marginBottom: '0.9rem' }}>
                      <ProgressBar current={current} total={total} height="6px" color="var(--color-sage)" />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedBook(book)}
                        className="btn-secondary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem' }}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSessionTargetBook(book);
                          setIsLogSessionModalOpen(true);
                        }}
                        className="btn-primary"
                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem' }}
                      >
                        <Clock size={13} />
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Your nightstand is empty"
            description="Pick a book from your library or add a new volume to begin your next literary adventure."
            actionText="Browse Bookshelf"
            onAction={() => setActiveTab('bookshelf')}
            icon={BookOpen}
          />
        )}
      </section>

      {/* 4. Recently Finished Shelf */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.2rem 0'
              }}
            >
              Recently finished
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: 0 }}>
              Volumes gently closed and placed back upon the quiet shelf.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('bookshelf')}
            className="btn-ghost"
            style={{ fontSize: '0.84rem' }}
          >
            View all books <ArrowRight size={14} />
          </button>
        </div>

        {recentlyFinishedBooks.length > 0 ? (
          <div
            className="recently-finished-grid"
            style={
              recentlyFinishedBooks.length < 4
                ? { gridTemplateColumns: `repeat(${recentlyFinishedBooks.length}, minmax(0, 280px))` }
                : undefined
            }
          >
            {recentlyFinishedBooks.map((book) => (
              <div
                key={book.id}
                className="recently-finished-card"
                onClick={() => setSelectedBook(book)}
                role="button"
                tabIndex={0}
                aria-label={`Open details for ${book.title} by ${book.author}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedBook(book);
                  }
                }}
              >
                <div className="recently-finished-cover-wrap">
                  <BookCover
                    coverUrl={book.coverUrl}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                  />
                </div>

                {book.genre && (
                  <div style={{ marginBottom: '0.35rem' }}>
                    <span className="book-badge genre-badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                      {book.genre}
                    </span>
                  </div>
                )}

                <h4
                  className="recently-finished-title"
                  title={book.title}
                >
                  {book.title}
                </h4>

                <p
                  className="recently-finished-author"
                  title={book.author}
                >
                  by {book.author}
                </p>

                <div className="recently-finished-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={12} strokeWidth={2.4} color="var(--color-olive)" />
                    <span>{book.dateFinished ? formatDate(book.dateFinished) : 'Completed'}</span>
                  </div>
                  {book.rating > 0 ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        color: '#C28B47',
                        fontWeight: 600,
                        fontSize: '0.78rem'
                      }}
                      title={`Rated ${book.rating} out of 5 stars`}
                    >
                      <Star size={12} fill="#C28B47" stroke="#C28B47" />
                      <span>{Number(book.rating).toFixed(book.rating % 1 === 0 ? 0 : 1)}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', fontStyle: 'italic' }}>
                      Unrated
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No finished books yet"
            description="As you complete your stories, they will rest here in quiet accomplishment."
            actionText="View Bookshelf"
            onAction={() => setActiveTab('bookshelf')}
          />
        )}
      </section>

      {/* 5. Reading Inspiration: Recommendation from user's collection */}
      {recommendedBook && (
        <section
          className="paper-card reading-inspiration-card"
          style={{
            padding: '2rem 2.25rem',
            backgroundColor: '#FAF7F2',
            border: '1px solid var(--color-border-warm)',
            borderRadius: 'var(--radius-lg)',
            display: 'grid',
            gridTemplateColumns: '130px 1fr auto',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          <div style={{ width: '130px' }}>
            <BookCover
              coverUrl={recommendedBook.coverUrl}
              title={recommendedBook.title}
              author={recommendedBook.author}
              genre={recommendedBook.genre}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={16} color="var(--color-terracotta)" />
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                Next From Your Collection
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.25rem 0'
              }}
            >
              {recommendedBook.title}
            </h3>

            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--color-ink-muted)', margin: '0 0 0.75rem 0' }}>
              by {recommendedBook.author} • {recommendedBook.genre} • {recommendedBook.totalPages} pages
            </p>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-ink)', lineHeight: 1.5, margin: 0, maxWidth: '600px' }}>
              {recommendedBook.description || 'Waiting patiently on your Want to Read shelf for its turn in your reading chair.'}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setSelectedBook(recommendedBook)}
              className="btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Open Book
            </button>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          .reading-inspiration-card {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .reading-inspiration-card div {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
