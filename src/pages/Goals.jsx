import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ProgressBar from '../components/ProgressBar';
import FinishedVolumesShelf from '../components/FinishedVolumesShelf';
import { calculatePace } from '../utils/statistics';
import { Sparkles, Edit2, Check } from 'lucide-react';

export default function Goals() {
  const { books, goal, setReadingGoal, selectedBook, setSelectedBook, showToast } = useLibrary();

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
                backgroundColor: 'var(--bg-muted)',
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
              backgroundColor: 'var(--color-paper-light)',
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
      <FinishedVolumesShelf
        books={completedThisYear}
        allBooks={books}
        currentYear={currentYear}
        onSelectBook={setSelectedBook}
        selectedBook={selectedBook}
      />

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
