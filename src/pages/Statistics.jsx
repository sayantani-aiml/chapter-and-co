import React, { useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  calculateTotalPagesRead,
  calculateTotalMinutes,
  calculateAverageRating,
  calculateGenreDistribution,
  calculateRatingDistribution,
  calculateMonthlyCompletedBooks,
  calculateHeatmapActivity,
  calculateReadingStreak
} from '../utils/statistics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BookOpen,
  Calendar,
  Flame,
  Star,
  Clock,
  Bookmark,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Statistics() {
  const { books, sessions, goal, theme } = useLibrary();

  const totalPages = useMemo(() => calculateTotalPagesRead(books, sessions), [books, sessions]);
  const totalMinutes = useMemo(() => calculateTotalMinutes(sessions), [sessions]);
  const avgRating = useMemo(() => calculateAverageRating(books), [books]);
  const streak = useMemo(() => calculateReadingStreak(sessions), [sessions]);

  const axisTextColor = theme === 'dark' ? '#B5A596' : '#6B645D';
  const axisCategoryColor = theme === 'dark' ? '#EFE6D8' : '#45372F';

  const currentYear = new Date().getFullYear();
  const completedBooks = useMemo(
    () => books.filter((b) => b.status === 'completed'),
    [books]
  );
  const completedThisYear = useMemo(
    () =>
      completedBooks.filter((b) => {
        if (!b.dateFinished) return true;
        return new Date(b.dateFinished).getFullYear() === currentYear;
      }).length,
    [completedBooks, currentYear]
  );

  const genreData = useMemo(() => calculateGenreDistribution(books), [books]);
  const ratingData = useMemo(() => calculateRatingDistribution(books), [books]);
  const monthlyData = useMemo(() => calculateMonthlyCompletedBooks(books), [books]);
  const heatmapDays = useMemo(() => calculateHeatmapActivity(sessions, 14), [sessions]);

  // Find most-read genre
  const mostReadGenre = useMemo(() => {
    if (genreData.length === 0) return 'None yet';
    const sorted = [...genreData].sort((a, b) => b.value - a.value);
    return sorted[0].name;
  }, [genreData]);

  // Custom vintage tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'var(--color-paper-card)',
            border: '1px solid var(--color-border-warm)',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-paper-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            color: 'var(--color-espresso)'
          }}
        >
          <div style={{ fontWeight: 600 }}>{label || payload[0].name}</div>
          <div style={{ color: 'var(--color-burgundy)' }}>
            {payload[0].value} {payload[0].value === 1 ? 'book' : 'books'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="statistics-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border-warm)', paddingBottom: '1.25rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            fontWeight: 600,
            color: 'var(--color-espresso)',
            margin: '0 0 0.35rem 0'
          }}
        >
          Reading Statistics
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
          A quiet accounting of pages turned, hours savoured, and literary voyages taken.
        </p>
      </div>

      {/* Top 4 Primary Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Completed This Year */}
        <div
          className="paper-card"
          style={{
            padding: '1.4rem',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
              Finished {currentYear}
            </span>
            <BookOpen size={16} color="var(--color-burgundy)" />
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-espresso)', lineHeight: 1 }}>
            {completedThisYear}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', marginTop: '0.35rem' }}>
            {completedBooks.length} total across all years
          </div>
        </div>

        {/* Total Pages Read */}
        <div
          className="paper-card"
          style={{
            padding: '1.4rem',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
              Pages Read
            </span>
            <Bookmark size={16} color="var(--color-sage)" />
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-espresso)', lineHeight: 1 }}>
            {totalPages.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-olive)', marginTop: '0.35rem' }}>
            {totalMinutes > 0 ? `~${Math.round(totalMinutes / 60)} hours logged` : 'Preserved in journal'}
          </div>
        </div>

        {/* Average Rating */}
        <div
          className="paper-card"
          style={{
            padding: '1.4rem',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
              Average Rating
            </span>
            <Star size={16} color="#C28B47" fill="#C28B47" />
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--color-espresso)', lineHeight: 1 }}>
            {avgRating > 0 ? avgRating : '—'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', marginTop: '0.35rem' }}>
            From rated collection
          </div>
        </div>

        {/* Favorite Genre */}
        <div
          className="paper-card"
          style={{
            padding: '1.4rem',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', fontWeight: 600 }}>
              Leading Genre
            </span>
            <Award size={16} color="var(--color-terracotta)" />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 700,
              color: 'var(--color-espresso)',
              lineHeight: 1.15,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {mostReadGenre}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', marginTop: '0.35rem' }}>
            Most frequented realm
          </div>
        </div>
      </div>

      {/* Reading Activity Heatmap Section */}
      <section
        className="paper-card"
        style={{
          padding: '1.75rem 2rem',
          backgroundColor: 'var(--color-paper-light)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
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
              <Calendar size={18} color="var(--color-olive)" />
              Reading Activity Heatmap
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--color-ink-muted)', margin: 0 }}>
              Days marked with quiet reading sessions over the past 14 weeks.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: 'var(--color-ink-muted)' }}>
            <span>Less</span>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-heatmap-0)', borderRadius: '2px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-heatmap-1)', borderRadius: '2px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-heatmap-2)', borderRadius: '2px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-heatmap-3)', borderRadius: '2px' }} />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(7, 14px)',
            gap: '4px',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {heatmapDays.map((day, idx) => {
            const colors = [
              'var(--color-heatmap-0)',
              'var(--color-heatmap-1)',
              'var(--color-heatmap-2)',
              'var(--color-heatmap-3)'
            ];
            const bg = colors[day.level];

            return (
              <div
                key={idx}
                title={`${day.date}: ${day.pages > 0 ? `${day.pages} pages read` : 'No reading logged'}`}
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: bg,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'transform var(--transition-fast)'
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Charts Grid: Monthly Books Completed & Genre Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {/* Chart 1: Books Completed per Month */}
        <div
          className="paper-card"
          style={{
            padding: '1.75rem',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              color: 'var(--color-espresso)',
              marginBottom: '0.25rem'
            }}
          >
            Books Finished per Month ({currentYear})
          </h3>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.84rem', color: 'var(--color-ink-muted)', marginBottom: '1.25rem' }}>
            Monthly rhythm of completed stories.
          </p>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisTextColor }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: axisTextColor }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="var(--color-burgundy)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Genre Distribution (Donut Chart) */}
        <div
          className="paper-card"
          style={{
            padding: '1.75rem',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              color: 'var(--color-espresso)',
              marginBottom: '0.25rem'
            }}
          >
            Genre Distribution
          </h3>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.84rem', color: 'var(--color-ink-muted)', marginBottom: '1.25rem' }}>
            The diverse landscapes of your personal library.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', height: 240 }}>
            <div style={{ width: '60%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
              {genreData.slice(0, 5).map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: entry.color, borderRadius: '2px', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-espresso)' }}>
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart 3: Rating Distribution */}
      <section
        className="paper-card"
        style={{
          padding: '1.75rem 2rem',
          backgroundColor: 'var(--color-paper-light)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            color: 'var(--color-espresso)',
            marginBottom: '0.25rem'
          }}
        >
          Rating Distribution
        </h3>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.84rem', color: 'var(--color-ink-muted)', marginBottom: '1.25rem' }}>
          How generously your stars have been bestowed upon your volumes.
        </p>

        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ratingData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: axisTextColor }} axisLine={false} tickLine={false} />
              <YAxis dataKey="stars" type="category" tick={{ fontSize: 12, fill: axisCategoryColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--color-terracotta)" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
