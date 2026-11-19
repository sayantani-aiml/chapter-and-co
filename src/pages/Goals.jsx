import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ProgressBar from '../components/ProgressBar';
import { calculatePace } from '../utils/statistics';
import { Target, CheckCircle, Award, Sparkles, BookOpen, Edit2, Check } from 'lucide-react';

export default function Goals() {
  const { books, goal, setReadingGoal, showToast } = useLibrary();

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(goal);

  const currentYear = new Date().getFullYear();
  const completedBooks = books.filter((b) => b.status === 'completed');
  const completedThisYear = completedBooks.filter((b) => {
    if (!b.dateFinished) return true;
    return new Date(b.dateFinished).getFullYear() === currentYear;
  });

  const completedCount = completedThisYear.length;
  const remaining = Math.max(0, goal - completedCount);
  const percentage = Math.min(100, Math.round((completedCount / (goal || 1)) * 100));
  const pace = calculatePace(completedCount, goal);

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const val = parseInt(goalInput, 10);
    if (!isNaN(val) && val > 0) {
      setReadingGoal(val);
      setIsEditingGoal(false);
      showToast(`Annual reading goal set to ${val} books.`);
    }
  };

  // Color options for bookshelf spines
  const SPINE_COLORS = [
    { bg: '#713D46', text: '#FAF7F2', border: '#5C2F37' }, // Burgundy
    { bg: '#59634F', text: '#FAF7F2', border: '#464E3E' }, // Olive
    { bg: '#45372F', text: '#FAF7F2', border: '#332822' }, // Dark espresso
    { bg: '#899581', text: '#2A2724', border: '#74806D' }, // Sage
    { bg: '#B97861', text: '#FAF7F2', border: '#9A5D48' }, // Terracotta
    { bg: '#C89D9B', text: '#342F2D', border: '#B28583' }  // Dusty Rose
  ];

  return (
    <div className="goals-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--color-border-warm)',
          paddingBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              fontWeight: 600,
              color: 'var(--color-espresso)',
              margin: '0 0 0.35rem 0'
            }}
          >
            Reading Goals &amp; Sanctuary
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.15rem',
              color: 'var(--color-ink-muted)',
              margin: 0
            }}
          >
            Nurturing your reading rhythm without hurry or haste.
          </p>
        </div>

        <div>
          {isEditingGoal ? (
            <form onSubmit={handleSaveGoal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="1"
                max="200"
                className="form-input"
                style={{ width: '80px', padding: '0.4rem 0.6rem', textAlign: 'center' }}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}>
                <Check size={14} />
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setGoalInput(goal);
                setIsEditingGoal(true);
              }}
              className="btn-outline"
            >
              <Edit2 size={14} />
              Adjust {currentYear} Goal ({goal} Books)
            </button>
          )}
        </div>
      </div>

      {/* Main Goal Progress Hero Card */}
      <section
        className="paper-card"
        style={{
          padding: '2.5rem',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-warm)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-paper-lg)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '2.5rem',
            alignItems: 'center'
          }}
          className="goals-hero-grid"
        >
          {/* Progress details */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                backgroundColor: 'var(--color-sage-light)',
                color: 'var(--color-olive)',
                marginBottom: '1rem'
              }}
            >
              <Sparkles size={14} />
              <span>{pace.badge}</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.2rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.5rem 0'
              }}
            >
              {completedCount} of {goal} volumes completed
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                color: 'var(--color-terracotta)',
                margin: '0 0 1.25rem 0'
              }}
            >
              {remaining === 0
                ? 'Your annual goal has been triumphantly fulfilled!'
                : `${remaining} ${remaining === 1 ? 'book' : 'books'} to go.`}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <ProgressBar
                current={completedCount}
                total={goal}
                height="10px"
                color="var(--color-burgundy)"
              />
            </div>

            {/* Encouraging message */}
            <div
              style={{
                backgroundColor: 'rgba(237, 228, 213, 0.4)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--color-sage)',
                fontSize: '0.92rem',
                color: 'var(--color-espresso-light)',
                lineHeight: 1.55
              }}
            >
              <strong>{pace.status}:</strong> {pace.message}
            </div>
          </div>

          {/* Artistic Circular Progress Badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backgroundColor: '#FAF7F2',
              borderRadius: '50%',
              width: '210px',
              height: '210px',
              margin: '0 auto',
              border: '6px double var(--color-border-warm)',
              boxShadow: 'var(--shadow-paper)',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-ink-muted)' }}>
              Completed
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '3.2rem', fontWeight: 700, color: 'var(--color-burgundy)', lineHeight: 1, margin: '0.2rem 0' }}>
              {percentage}%
            </span>
            <span style={{ fontSize: '0.8rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--color-espresso-light)' }}>
              {currentYear} Reading Goal
            </span>
          </div>
        </div>
      </section>

      {/* Visual Bookshelf of Completed Books This Year */}
      <section
        className="paper-card"
        style={{
          padding: '2rem 2.25rem',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.6rem',
              color: 'var(--color-espresso)',
              margin: '0 0 0.2rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <BookOpen size={20} color="var(--color-burgundy)" />
            Your {currentYear} Finished Volumes Shelf
          </h3>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--color-ink-muted)', margin: 0 }}>
            Each completed book placed spine-out upon the wooden shelf.
          </p>
        </div>

        {/* Physical Bookshelf Representation */}
        <div
          style={{
            backgroundColor: '#FAF7F2',
            padding: '2rem 1.5rem 0',
            border: '1px solid var(--color-border-warm)',
            borderRadius: 'var(--radius-md)',
            position: 'relative'
          }}
        >
          {/* Spines container */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '6px',
              minHeight: '190px',
              overflowX: 'auto',
              paddingBottom: '0.5rem'
            }}
          >
            {completedThisYear.length > 0 ? (
              completedThisYear.map((book, idx) => {
                const spineTheme = SPINE_COLORS[idx % SPINE_COLORS.length];
                const height = 150 + (idx % 4) * 12; // Realistic slight variation in book height

                return (
                  <div
                    key={book.id}
                    title={`${book.title} by ${book.author}`}
                    style={{
                      width: '38px',
                      height: `${height}px`,
                      backgroundColor: spineTheme.bg,
                      color: spineTheme.text,
                      border: `1px solid ${spineTheme.border}`,
                      borderRadius: '3px 3px 0 0',
                      boxShadow: '2px 0 6px rgba(0,0,0,0.2) inset, 2px 2px 5px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      position: 'relative',
                      transition: 'transform var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Spine embossed gold band top & bottom */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '2px',
                        right: '2px',
                        height: '2px',
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '2px',
                        right: '2px',
                        height: '2px',
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }}
                    />

                    {/* Rotated Spine Title */}
                    <span
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: `${height - 30}px`,
                        padding: '0 2px'
                      }}
                    >
                      {book.title}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--color-ink-muted)', fontStyle: 'italic' }}>
                Your shelf is freshly dusted and awaiting its first completed book of {currentYear}.
              </div>
            )}
          </div>

          {/* Wooden Shelf Bar */}
          <div
            style={{
              height: '16px',
              backgroundColor: '#5C4B40',
              borderTop: '2px solid #8B7364',
              borderRadius: '2px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
              margin: '0 -1.5rem',
              position: 'relative'
            }}
          />
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .goals-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
