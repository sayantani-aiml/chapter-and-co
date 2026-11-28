import React, { useState, useEffect } from 'react';

// Palette options for bespoke book covers when image is not provided or fails to load
const COVER_THEMES = [
  { bg: '#713D46', text: '#FAF7F2', border: '#8F535D', spine: '#4F282F', accent: '#D8A7AF' }, // Burgundy
  { bg: '#59634F', text: '#FAF7F2', border: '#727E66', spine: '#3D4436', accent: '#B7C4AD' }, // Olive
  { bg: '#45372F', text: '#FAF7F2', border: '#5C4B40', spine: '#2C221D', accent: '#D9C1A5' }, // Espresso
  { bg: '#B97861', text: '#FAF7F2', border: '#CF917C', spine: '#8B5441', accent: '#F5D3C7' }, // Terracotta
  { bg: '#899581', text: '#262422', border: '#9FAA96', spine: '#687461', accent: '#373430' }, // Sage
  { bg: '#302D29', text: '#F6F1E7', border: '#4A4641', spine: '#1F1D1B', accent: '#C89D9B' }  // Soft Ink
];

export default function BookCover({
  coverUrl,
  title = 'Untitled',
  author = 'Unknown Author',
  genre = '',
  className = '',
  style = {}
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [coverUrl]);

  // Deterministically select a cover theme based on the book's title
  const themeIndex = title
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % COVER_THEMES.length;
  const theme = COVER_THEMES[themeIndex];

  if (coverUrl && !imageError) {
    return (
      <div
        className={`book-cover-container ${className}`}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '4px',
          boxShadow: 'var(--shadow-book-spine)',
          aspectRatio: '2 / 3',
          backgroundColor: 'var(--color-antique-paper)',
          ...style
        }}
      >
        <img
          src={coverUrl}
          alt={`Cover of ${title}`}
          loading="lazy"
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        {/* Subtle physical book spine effect on the left edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '12px',
            background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.15) 30%, rgba(0,0,0,0.1) 70%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>
    );
  }

  // Bespoke editorial cover fallback
  return (
    <div
      className={`book-cover-container bespoke-cover ${className}`}
      style={{
        position: 'relative',
        borderRadius: '4px',
        boxShadow: 'var(--shadow-book-spine)',
        aspectRatio: '2 / 3',
        backgroundColor: theme.bg,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 1rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: `1px solid ${theme.border}`,
        ...style
      }}
    >
      {/* Spine highlight and shadow overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '12px',
          background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.2) 25%, rgba(0,0,0,0.15) 60%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Decorative inner frame */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '14px',
          right: '6px',
          bottom: '6px',
          border: `1px solid ${theme.accent}`,
          opacity: 0.45,
          pointerEvents: 'none',
          borderRadius: '2px'
        }}
      />

      {/* Header flourish / genre */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: theme.accent,
            display: 'block'
          }}
        >
          {genre || 'Chapter & Co.'}
        </span>
        <div
          style={{
            width: '24px',
            height: '1px',
            backgroundColor: theme.accent,
            opacity: 0.6,
            margin: '0.4rem auto 0'
          }}
        />
      </div>

      {/* Center Title */}
      <div style={{ textAlign: 'center', margin: 'auto 0', zIndex: 1, padding: '0 0.5rem' }}>
        <h4
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: title.length > 25 ? '1.05rem' : '1.3rem',
            lineHeight: 1.25,
            fontWeight: 600,
            color: theme.text,
            letterSpacing: '-0.01em',
            margin: 0,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          {title}
        </h4>
      </div>

      {/* Footer Author */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div
          style={{
            width: '24px',
            height: '1px',
            backgroundColor: theme.accent,
            opacity: 0.6,
            margin: '0 auto 0.4rem'
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '0.8rem',
            color: theme.accent,
            margin: 0
          }}
        >
          {author}
        </p>
      </div>
    </div>
  );
}
