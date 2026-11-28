import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BookOpen, ArrowUpDown, Sparkles, Star, Maximize2 } from 'lucide-react';
import BookCover from './BookCover';
import FullScreenBookcase from './FullScreenBookcase';
import { formatDate } from '../utils/dates';
import {
  extractCoverPalette,
  getCachedSpinePalette
} from '../utils/coverColorExtractor';
import { BrassBookend, PottedPlant, VintageCandle } from './ShelfProps';
import './FinishedVolumesShelf.css';

function getBookHash(book) {
  const key = `${book.id || ''}-${book.title || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getSpineWidth(totalPages) {
  const pages = Number(totalPages) || 260;
  const clampedPages = Math.min(Math.max(pages, 100), 850);
  const ratio = (clampedPages - 100) / (850 - 100);
  return Math.round(34 + ratio * (64 - 34));
}

function getSpineHeight(book) {
  const hash = getBookHash(book);
  return 154 + (hash % 5) * 10;
}

export default function FinishedVolumesShelf({
  books = [],
  allBooks = [],
  currentYear,
  onSelectBook,
  selectedBook
}) {
  const [sortBy, setSortBy] = useState('date');
  const [showDecor, setShowDecor] = useState(true);
  const [isBookcaseOpen, setIsBookcaseOpen] = useState(false);
  const [palettes, setPalettes] = useState({});
  const [containerWidth, setContainerWidth] = useState(820);
  const frameRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const initial = {};
    books.forEach((b) => {
      initial[b.id] = getCachedSpinePalette(b);
    });
    setPalettes(initial);

    books.forEach((b) => {
      if (b.coverUrl) {
        extractCoverPalette(b).then((pal) => {
          if (!cancelled) {
            setPalettes((prev) => ({ ...prev, [b.id]: pal }));
          }
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [books]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;

    const updateWidth = () => {
      if (el) {
        setContainerWidth(Math.max(260, el.clientWidth - 64));
      }
    };

    updateWidth();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(el);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const sortedBooks = useMemo(() => {
    const list = [...books];
    switch (sortBy) {
      case 'color':
        return list.sort((a, b) => {
          const palA = palettes[a.id] || getCachedSpinePalette(a);
          const palB = palettes[b.id] || getCachedSpinePalette(b);
          const diff = (palA.order || 0) - (palB.order || 0);
          if (diff !== 0) return diff;
          return (a.title || '').localeCompare(b.title || '');
        });
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'pages':
        return list.sort((a, b) => (b.totalPages || 0) - (a.totalPages || 0));
      case 'date':
      default:
        return list.sort((a, b) => {
          const dateA = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
          const dateB = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;
          return dateB - dateA;
        });
    }
  }, [books, sortBy, palettes]);

  const tiers = useMemo(() => {
    if (sortedBooks.length === 0) return [];
    const decorReserve = showDecor ? 150 : 24;
    const gap = 6;
    const rows = [];
    let currentRow = [];
    let currentWidth = 0;

    sortedBooks.forEach((book) => {
      const w = getSpineWidth(book.totalPages);
      const nextWidth = currentRow.length === 0 ? w : currentWidth + gap + w;
      if (currentRow.length > 0 && nextWidth > containerWidth - 16) {
        rows.push(currentRow);
        currentRow = [book];
        currentWidth = w;
      } else {
        currentRow.push(book);
        currentWidth = nextWidth;
      }
    });

    if (currentRow.length > 0) {
      if (showDecor && currentWidth + decorReserve > containerWidth && currentRow.length > 1) {
        const overflowBook = currentRow.pop();
        rows.push(currentRow);
        rows.push([overflowBook]);
      } else {
        rows.push(currentRow);
      }
    }

    return rows;
  }, [sortedBooks, containerWidth, showDecor]);

  return (
    <>
      <section className="paper-card finished-shelf-card">
        {/* Shelf Header & Controls */}
        <div className="finished-shelf-header">
          <div>
            <h3 className="finished-shelf-title">
              <BookOpen size={20} color="var(--color-burgundy)" />
              Your {currentYear} Finished Volumes Shelf
            </h3>
            <p className="finished-shelf-subtitle">
              Hover a spine to preview, click a volume to inspect, or open the full bookcase.
            </p>
          </div>

          <div className="finished-shelf-toolbar">
            <div className="shelf-sort-group">
              <label htmlFor="shelf-sort-select" className="shelf-sort-label">
                <ArrowUpDown size={12} />
                Sort
              </label>
              <select
                id="shelf-sort-select"
                className="shelf-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Finish Date</option>
                <option value="color">Color</option>
                <option value="rating">Rating</option>
                <option value="pages">Length (Pages)</option>
              </select>
            </div>

            <button
              type="button"
              className={`shelf-decor-toggle ${showDecor ? 'active' : ''}`}
              onClick={() => setShowDecor((prev) => !prev)}
              aria-pressed={showDecor}
            >
              <Sparkles size={13} />
              Shelf Decor {showDecor ? 'On' : 'Off'}
            </button>

            <button
              type="button"
              className="shelf-expand-btn"
              onClick={() => setIsBookcaseOpen(true)}
            >
              <Maximize2 size={13} />
              Open Full Bookcase
            </button>
          </div>
        </div>

        {/* Physical Bookcase Frame (clicking empty shelf background also opens Full Bookcase) */}
        <div
          className="bookcase-frame"
          ref={frameRef}
          onClick={() => setIsBookcaseOpen(true)}
          style={{ cursor: 'pointer' }}
          title="Click shelf to open Full-Screen Bookcase"
        >
          <div className="bookcase-spotlight" aria-hidden="true" />

          {tiers.length > 0 ? (
            tiers.map((rowBooks, tierIndex) => {
              const isLastTier = tierIndex === tiers.length - 1;

              return (
                <div className="shelf-tier" key={`tier-${tierIndex}`}>
                  <div className="shelf-row">
                    {rowBooks.map((book, idx) => {
                      const isVeryLastBook = isLastTier && idx === rowBooks.length - 1;
                      const spineTheme = palettes[book.id] || getCachedSpinePalette(book);
                      const width = getSpineWidth(book.totalPages);
                      const height = getSpineHeight(book);
                      const rating = Math.round(book.rating || 0);
                      const isFiveStar = rating >= 5;

                      return (
                        <button
                          key={book.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBook(book);
                          }}
                          className={`book-spine-btn ${isFiveStar ? 'is-five-star' : ''} ${
                            isVeryLastBook ? 'is-last-leaning' : ''
                          }`}
                          style={{
                            width: `${width}px`,
                            height: `${height}px`,
                            backgroundColor: spineTheme.bg,
                            color: spineTheme.text,
                            border: `1px solid ${spineTheme.border}`
                          }}
                          aria-label={`${book.title} by ${book.author}`}
                        >
                          <span className="spine-band top" />
                          <span className="spine-band top-inner" />
                          <span className="spine-band bottom-inner" />
                          <span className="spine-band bottom" />

                          {isFiveStar && (
                            <span className="spine-gold-star" aria-label="5-star favourite">
                              ★
                            </span>
                          )}

                          <span
                            className="spine-title-text"
                            style={{ maxHeight: `${height - (isFiveStar ? 48 : 36)}px` }}
                          >
                            {book.title}
                          </span>

                          {/* Floating Vintage Tooltip Card */}
                          <div className="spine-tooltip" role="tooltip">
                            <div className="spine-tooltip-cover">
                              <BookCover
                                coverUrl={book.coverUrl}
                                title={book.title}
                                author={book.author}
                                genre={book.genre}
                              />
                            </div>
                            <div className="spine-tooltip-info">
                              <div className="spine-tooltip-title">{book.title}</div>
                              <div className="spine-tooltip-author">by {book.author}</div>
                              <div className="spine-tooltip-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={12}
                                    fill={star <= rating ? '#C28B47' : 'none'}
                                    stroke={star <= rating ? '#C28B47' : 'var(--color-border-warm)'}
                                  />
                                ))}
                              </div>
                              <div className="spine-tooltip-date">
                                {book.dateFinished
                                  ? `Finished ${formatDate(book.dateFinished)}`
                                  : `${book.totalPages || '—'} pages`}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Vintage Shelf Decor on the right side of the last tier */}
                    {isLastTier && showDecor && (
                      <div className="shelf-decor-cluster">
                        <BrassBookend />
                        <PottedPlant />
                        <VintageCandle />
                      </div>
                    )}
                  </div>

                  {/* Realistic Wooden Plank */}
                  <div className="wooden-plank" aria-hidden="true" />
                </div>
              );
            })
          ) : (
            <div className="shelf-tier">
              <div className="shelf-row">
                <div className="shelf-empty-state">
                  Your shelf is freshly dusted and awaiting its first completed book of {currentYear}.
                </div>
                {showDecor && (
                  <div className="shelf-decor-cluster">
                    <PottedPlant />
                    <VintageCandle />
                  </div>
                )}
              </div>
              <div className="wooden-plank" aria-hidden="true" />
            </div>
          )}
        </div>
      </section>

      <FullScreenBookcase
        isOpen={isBookcaseOpen}
        onClose={() => setIsBookcaseOpen(false)}
        books={allBooks.length > 0 ? allBooks : books}
        onSelectBook={onSelectBook}
        selectedBook={selectedBook}
      />
    </>
  );
}
