import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Columns,
  LayoutGrid,
  Layers,
  Sliders,
  ArrowUpDown,
  Star,
  Repeat,
  RotateCcw,
  Library
} from 'lucide-react';
import BookCover from './BookCover';
import { formatDate } from '../utils/dates';
import {
  extractCoverPalette,
  getCachedSpinePalette
} from '../utils/coverColorExtractor';
import {
  PROP_CATALOG,
  DEFAULT_SHELF_STUDIO,
  renderShelfProp
} from './ShelfProps';
import './FinishedVolumesShelf.css';
import './FullScreenBookcase.css';

const ORDER_KEY = 'chapter_co_shelf_order';
const STYLES_KEY = 'chapter_co_shelf_styles';
const PROPS_KEY = 'chapter_co_shelf_props';
const SERIES_LAYOUTS_KEY = 'chapter_co_series_layouts';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Books' },
  { id: 'completed', label: 'Completed' },
  { id: 'currently-reading', label: 'Currently Reading' },
  { id: 'want-to-read', label: 'Want to Read' }
];

const WOOD_FINISHES = [
  { id: 'walnut', label: 'Dark Walnut', swatch: '#4b362b' },
  { id: 'oak', label: 'Warm Oak', swatch: '#b58a58' },
  { id: 'mahogany', label: 'Mahogany', swatch: '#6d2f27' }
];

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

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
  const clamped = Math.min(Math.max(pages, 100), 850);
  const ratio = (clamped - 100) / (850 - 100);
  return Math.round(34 + ratio * (64 - 34));
}

function getSpineHeight(book) {
  return 156 + (getBookHash(book) % 5) * 10;
}

function getHorizontalHeight(totalPages) {
  const pages = Number(totalPages) || 260;
  const clamped = Math.min(Math.max(pages, 100), 850);
  const ratio = (clamped - 100) / (850 - 100);
  return Math.round(28 + ratio * 16);
}

function getDefaultCuratedStyle(book, index) {
  if (index % 6 === 0) return 'cover';
  if (index % 6 === 3 || index % 6 === 4) return 'stack';
  return 'spine';
}

const NEXT_STYLE = {
  spine: 'cover',
  cover: 'stack',
  stack: 'spine'
};

const STYLE_LABELS = {
  spine: 'Spine',
  cover: 'Cover',
  stack: 'Stack'
};

function getNormalizedSeriesKey(book) {
  return book?.series?.name ? book.series.name.trim().toLowerCase() : '';
}

export default function FullScreenBookcase({
  isOpen,
  onClose,
  books = [],
  onSelectBook,
  selectedBook
}) {
  const [filter, setFilter] = useState('all');
  const [layout, setLayout] = useState('curated'); // 'covers' | 'spines' | 'curated'
  const [groupBySeries, setGroupBySeries] = useState(true);
  const [sortBy, setSortBy] = useState(() => {
    const saved = loadJSON(ORDER_KEY, []);
    return saved.length > 0 ? 'custom' : 'date';
  });
  const [customOrder, setCustomOrder] = useState(() => loadJSON(ORDER_KEY, []));
  const [bookStyles, setBookStyles] = useState(() => loadJSON(STYLES_KEY, {}));
  const [seriesLayouts, setSeriesLayouts] = useState(() => loadJSON(SERIES_LAYOUTS_KEY, {}));
  const [studio, setStudio] = useState(() => ({
    ...DEFAULT_SHELF_STUDIO,
    ...loadJSON(PROPS_KEY, {})
  }));
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const [palettes, setPalettes] = useState({});
  const [containerWidth, setContainerWidth] = useState(960);
  const [draggedIds, setDraggedIds] = useState([]);
  const [dragOverKey, setDragOverKey] = useState(null);

  const cabinetRef = useRef(null);
  const isDraggingRef = useRef(false);

  // When switching into Curated view, default Group by Series to ON
  const handleLayoutChange = (nextLayout) => {
    setLayout(nextLayout);
    if (nextLayout === 'curated') {
      setGroupBySeries(true);
    }
  };

  // Extract Cover-to-Spine palettes
  useEffect(() => {
    if (!isOpen) return undefined;
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
  }, [books, isOpen]);

  // Esc key handler (only closes bookcase when BookDetailModal isn't open)
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !selectedBook) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedBook, onClose]);

  // Measure cabinet inner width for clean tier wrapping
  useEffect(() => {
    if (!isOpen) return undefined;
    const el = cabinetRef.current;
    if (!el) return undefined;

    const updateWidth = () => {
      if (el) {
        setContainerWidth(Math.max(280, el.clientWidth - 88));
      }
    };
    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const obs = new ResizeObserver(updateWidth);
      obs.observe(el);
      return () => obs.disconnect();
    }
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [isOpen, isStudioOpen]);

  // Persist studio, styles, series layouts, order
  useEffect(() => {
    try {
      localStorage.setItem(PROPS_KEY, JSON.stringify(studio));
    } catch {}
  }, [studio]);

  useEffect(() => {
    try {
      localStorage.setItem(STYLES_KEY, JSON.stringify(bookStyles));
    } catch {}
  }, [bookStyles]);

  useEffect(() => {
    try {
      localStorage.setItem(SERIES_LAYOUTS_KEY, JSON.stringify(seriesLayouts));
    } catch {}
  }, [seriesLayouts]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(customOrder));
    } catch {}
  }, [customOrder]);

  const filteredBooks = useMemo(() => {
    const base =
      filter === 'all' ? books : books.filter((b) => b.status === filter);
    const list = [...base];

    switch (sortBy) {
      case 'custom': {
        const orderMap = new Map(customOrder.map((id, idx) => [id, idx]));
        return list.sort((a, b) => {
          const idxA = orderMap.has(a.id) ? orderMap.get(a.id) : 99999;
          const idxB = orderMap.has(b.id) ? orderMap.get(b.id) : 99999;
          return idxA - idxB;
        });
      }
      case 'color':
        return list.sort((a, b) => {
          const palA = palettes[a.id] || getCachedSpinePalette(a);
          const palB = palettes[b.id] || getCachedSpinePalette(b);
          return (palA.order || 0) - (palB.order || 0);
        });
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'pages':
        return list.sort((a, b) => (b.totalPages || 0) - (a.totalPages || 0));
      case 'date':
      default:
        return list.sort((a, b) => {
          const da = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
          const db = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;
          return db - da;
        });
    }
  }, [books, filter, sortBy, customOrder, palettes]);

  // Build renderable shelf units (including series groups when enabled) and split into tiers
  const tiers = useMemo(() => {
    if (filteredBooks.length === 0) return [[]];
    const gap = 10;

    // 1. Identify multi-book series if groupBySeries is active
    const seriesBuckets = new Map();
    if (groupBySeries) {
      filteredBooks.forEach((book) => {
        const key = getNormalizedSeriesKey(book);
        if (!key) return;
        if (!seriesBuckets.has(key)) seriesBuckets.set(key, []);
        seriesBuckets.get(key).push(book);
      });
    }

    // Build ordered sequence of raw items (either series group or individual book)
    const rawSequence = [];
    const emittedSeries = new Set();

    filteredBooks.forEach((book) => {
      const sKey = getNormalizedSeriesKey(book);
      const bucket = sKey ? seriesBuckets.get(sKey) : null;
      if (groupBySeries && bucket && bucket.length >= 2) {
        if (!emittedSeries.has(sKey)) {
          emittedSeries.add(sKey);
          const sortedSeriesBooks = [...bucket].sort(
            (a, b) => (Number(a.series?.number) || 0) - (Number(b.series?.number) || 0)
          );
          const sLayout = seriesLayouts[sKey] || 'feature';
          let width = 0;
          if (sLayout === 'stack') {
            width = 186;
          } else if (sLayout === 'leaning') {
            width =
              sortedSeriesBooks.reduce((acc, b) => acc + getSpineWidth(b.totalPages) + 5, 0) + 18;
          } else {
            // feature: book #1 cover (116px) + remaining spines
            width =
              116 +
              sortedSeriesBooks
                .slice(1)
                .reduce((acc, b) => acc + getSpineWidth(b.totalPages) + 5, 0) +
              14;
          }
          rawSequence.push({
            type: 'series',
            seriesKey: sKey,
            seriesName: sortedSeriesBooks[0].series.name,
            seriesLayout: sLayout,
            books: sortedSeriesBooks,
            width
          });
        }
      } else {
        rawSequence.push({ type: 'single', book });
      }
    });

    // 2. Convert rawSequence into layout units (grouping consecutive 'stack' singles in Curated view)
    const units = [];
    let pendingStack = [];
    let singleIdx = 0;

    const flushStack = () => {
      if (pendingStack.length > 0) {
        units.push({ type: 'stack', items: pendingStack, width: 184 });
        pendingStack = [];
      }
    };

    rawSequence.forEach((item) => {
      if (item.type === 'series') {
        flushStack();
        units.push(item);
        return;
      }

      const { book } = item;
      if (layout === 'curated') {
        const style = bookStyles[book.id] || getDefaultCuratedStyle(book, singleIdx);
        singleIdx += 1;
        if (style === 'stack') {
          pendingStack.push({ book, style });
          if (pendingStack.length === 4) flushStack();
        } else {
          flushStack();
          units.push({
            type: style,
            book,
            width: style === 'cover' ? 112 : getSpineWidth(book.totalPages)
          });
        }
      } else {
        flushStack();
        units.push({
          type: layout === 'covers' ? 'cover' : 'spine',
          book,
          width: layout === 'covers' ? 112 : getSpineWidth(book.totalPages)
        });
      }
    });
    flushStack();

    // 3. Wrap units cleanly into wooden tiers
    const rows = [];
    let currentRow = [];
    let currentWidth = 0;
    const usableWidth = Math.max(240, containerWidth - 130);

    units.forEach((unit) => {
      const nextW = currentRow.length === 0 ? unit.width : currentWidth + gap + unit.width;
      if (currentRow.length > 0 && nextW > usableWidth) {
        rows.push(currentRow);
        currentRow = [unit];
        currentWidth = unit.width;
      } else {
        currentRow.push(unit);
        currentWidth = nextW;
      }
    });
    if (currentRow.length > 0) rows.push(currentRow);
    return rows;
  }, [filteredBooks, layout, groupBySeries, bookStyles, seriesLayouts, containerWidth]);

  if (!isOpen) return null;

  // Drag & Drop handlers (supports both single books and series groups)
  const handleDragStart = (e, ids) => {
    isDraggingRef.current = true;
    const idList = Array.isArray(ids) ? ids : [ids];
    setDraggedIds(idList);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(idList));
  };

  const handleDragOver = (e, targetKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverKey !== targetKey) {
      setDragOverKey(targetKey);
    }
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    let sourceIds = draggedIds;
    if (!sourceIds || sourceIds.length === 0) {
      try {
        sourceIds = JSON.parse(e.dataTransfer.getData('text/plain'));
      } catch {
        sourceIds = [];
      }
    }
    setDragOverKey(null);
    setDraggedIds([]);
    if (!sourceIds.length || sourceIds.includes(targetId)) return;

    const currentIds = filteredBooks.map((b) => b.id);
    const sourceSet = new Set(sourceIds);
    const remainingVisible = currentIds.filter((id) => !sourceSet.has(id));
    const insertIdx = remainingVisible.indexOf(targetId);
    if (insertIdx === -1) return;

    const reorderedVisible = [
      ...remainingVisible.slice(0, insertIdx),
      ...sourceIds.filter((id) => currentIds.includes(id)),
      ...remainingVisible.slice(insertIdx)
    ];

    const visibleSet = new Set(reorderedVisible);
    const hiddenIds = books.map((b) => b.id).filter((id) => !visibleSet.has(id));
    setCustomOrder([...reorderedVisible, ...hiddenIds]);
    setSortBy('custom');
  };

  const handleDragEnd = () => {
    setDraggedIds([]);
    setDragOverKey(null);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 90);
  };

  const handleBookClick = (e, book) => {
    if (e) e.stopPropagation();
    if (isDraggingRef.current) return;
    onSelectBook(book);
  };

  const cycleBookStyle = (e, bookId, currentStyle) => {
    e.stopPropagation();
    setBookStyles((prev) => ({
      ...prev,
      [bookId]: NEXT_STYLE[currentStyle] || 'spine'
    }));
  };

  const setSeriesLayout = (e, seriesKey, nextMode) => {
    e.stopPropagation();
    setSeriesLayouts((prev) => ({
      ...prev,
      [seriesKey]: nextMode
    }));
  };

  const updatePropConfig = (propId, patch) => {
    setStudio((prev) => ({
      ...prev,
      props: prev.props.map((p) => (p.id === propId ? { ...p, ...patch } : p))
    }));
  };

  const getPropsForTier = (tierIndex, totalTiers, side) => {
    return (studio.props || []).filter((p) => {
      if (!p.enabled || p.side !== side) return false;
      if (p.shelf === 'first') return tierIndex === 0;
      if (p.shelf === 'last') return tierIndex === totalTiers - 1;
      if (p.shelf === 'middle') {
        const mid = Math.floor((totalTiers - 1) / 2);
        return tierIndex === mid;
      }
      return tierIndex === totalTiers - 1;
    });
  };

  const renderTooltip = (book, rating) => (
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
  );

  const renderSpineButton = (book, extraClass = '') => {
    const pal = palettes[book.id] || getCachedSpinePalette(book);
    const rating = Math.round(book.rating || 0);
    const isFiveStar = rating >= 5;
    const width = getSpineWidth(book.totalPages);
    const height = getSpineHeight(book);

    return (
      <button
        type="button"
        onClick={(e) => handleBookClick(e, book)}
        className={`book-spine-btn ${isFiveStar ? 'is-five-star' : ''} ${extraClass}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: pal.bg,
          color: pal.text,
          border: `1px solid ${pal.border}`
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

        {renderTooltip(book, rating)}
      </button>
    );
  };

  const renderHorizontalBook = (book, offset = 0) => {
    const pal = palettes[book.id] || getCachedSpinePalette(book);
    const rating = Math.round(book.rating || 0);
    const isFiveStar = rating >= 5;
    const h = getHorizontalHeight(book.totalPages);

    return (
      <button
        type="button"
        onClick={(e) => handleBookClick(e, book)}
        className={`book-horizontal-spine-btn ${isFiveStar ? 'is-five-star' : ''}`}
        style={{
          height: `${h}px`,
          backgroundColor: pal.bg,
          color: pal.text,
          border: `1px solid ${pal.border}`,
          transform: offset ? `translateX(${offset}px)` : undefined
        }}
        aria-label={`${book.title} by ${book.author}`}
      >
        <span className="h-spine-band left" />
        <span className="h-spine-band right" />
        <span className="h-spine-title">{book.title}</span>
        <span className="h-spine-author">{book.author}</span>
        {renderTooltip(book, rating)}
      </button>
    );
  };

  const renderSeriesGroup = (unit) => {
    const { seriesKey, seriesName, seriesLayout, books: seriesBooks } = unit;
    const seriesIds = seriesBooks.map((b) => b.id);
    const firstId = seriesIds[0];
    const isDragging = seriesIds.some((id) => draggedIds.includes(id));

    return (
      <div
        key={`series-${seriesKey}`}
        className={`series-group-slot ${isDragging ? 'is-dragging' : ''} ${
          dragOverKey === `series-${seriesKey}` ? 'is-drag-over' : ''
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, seriesIds)}
        onDragOver={(e) => handleDragOver(e, `series-${seriesKey}`)}
        onDrop={(e) => handleDrop(e, firstId)}
        onDragEnd={handleDragEnd}
      >
        {/* Subtle Hover Menu for Series Orientations */}
        <div className="series-hover-menu" onClick={(e) => e.stopPropagation()}>
          <span className="series-hover-label" title={seriesName}>
            {seriesName}
          </span>
          {[
            { id: 'feature', label: 'Feature' },
            { id: 'stack', label: 'Stack' },
            { id: 'leaning', label: 'Lean' }
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`series-layout-chip ${seriesLayout === opt.id ? 'active' : ''}`}
              onClick={(e) => setSeriesLayout(e, seriesKey, opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {seriesLayout === 'stack' ? (
          <div className="book-stack-column">
            {[...seriesBooks].reverse().map((book) => {
              const offset = ((getBookHash(book) % 5) - 2) * 2;
              return (
                <div key={book.id} style={{ position: 'relative' }}>
                  {renderHorizontalBook(book, offset)}
                </div>
              );
            })}
          </div>
        ) : seriesLayout === 'leaning' ? (
          seriesBooks.map((book, idx) => (
            <div key={book.id} style={{ position: 'relative' }}>
              {renderSpineButton(
                book,
                idx === seriesBooks.length - 1 ? 'is-series-leaning' : ''
              )}
            </div>
          ))
        ) : (
          /* Feature Display (Default): Book #1 on display stand + remaining spines */
          <>
            <div className="series-feature-stand">
              <button
                type="button"
                className="book-cover-shelf-btn"
                onClick={(e) => handleBookClick(e, seriesBooks[0])}
                aria-label={`${seriesBooks[0].title} by ${seriesBooks[0].author}`}
              >
                <BookCover
                  coverUrl={seriesBooks[0].coverUrl}
                  title={seriesBooks[0].title}
                  author={seriesBooks[0].author}
                  genre={seriesBooks[0].genre}
                />
                {renderTooltip(seriesBooks[0], Math.round(seriesBooks[0].rating || 0))}
              </button>
              <div className="series-display-easel" aria-hidden="true" />
            </div>
            {seriesBooks.slice(1).map((book) => (
              <div key={book.id} style={{ position: 'relative' }}>
                {renderSpineButton(book)}
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bookcase-overlay" role="dialog" aria-modal="true" aria-label="Full-Screen Bookcase">
      <div className="bookcase-shell">
        {/* Top Bar */}
        <header className="bookcase-topbar">
          <div className="bookcase-topbar-left">
            <div className="bookcase-brand">
              <h2>Chapter &amp; Co. Bookcase</h2>
              <span className="bookcase-count-pill">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'volume' : 'volumes'}
              </span>
            </div>

            <div className="bookcase-filter-pills">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`bookcase-filter-pill ${filter === opt.id ? 'active' : ''}`}
                  onClick={() => setFilter(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bookcase-topbar-right">
            {/* 3-Way Layout Switcher */}
            <div className="layout-switcher" role="group" aria-label="Bookcase layout">
              <button
                type="button"
                className={`layout-switch-btn ${layout === 'covers' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('covers')}
              >
                <LayoutGrid size={13} />
                Covers
              </button>
              <button
                type="button"
                className={`layout-switch-btn ${layout === 'spines' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('spines')}
              >
                <Columns size={13} />
                Spines
              </button>
              <button
                type="button"
                className={`layout-switch-btn ${layout === 'curated' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('curated')}
              >
                <Layers size={13} />
                Curated
              </button>
            </div>

            {/* Group by Series Toggle */}
            <button
              type="button"
              className={`shelf-decor-toggle ${groupBySeries ? 'active' : ''}`}
              onClick={() => setGroupBySeries((prev) => !prev)}
              aria-pressed={groupBySeries}
            >
              <Library size={13} />
              Group by Series
            </button>

            {/* Sort */}
            <div className="shelf-sort-group">
              <label htmlFor="fullscreen-sort" className="shelf-sort-label">
                <ArrowUpDown size={12} />
                Sort
              </label>
              <select
                id="fullscreen-sort"
                className="shelf-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="custom">Custom Order</option>
                <option value="date">Finish Date</option>
                <option value="color">Color</option>
                <option value="rating">Rating</option>
                <option value="pages">Length (Pages)</option>
              </select>
            </div>

            <button
              type="button"
              className={`shelf-decor-toggle ${isStudioOpen ? 'active' : ''}`}
              onClick={() => setIsStudioOpen((prev) => !prev)}
            >
              <Sliders size={13} />
              Customize Shelf &amp; Props
            </button>

            <button type="button" className="bookcase-close-btn" onClick={onClose}>
              <X size={15} />
              Close
            </button>
          </div>
        </header>

        {/* Main Content + Studio Drawer */}
        <div className="bookcase-body">
          <div className="bookcase-scroll-area">
            <div className={`fullscreen-cabinet wood-${studio.woodFinish}`} ref={cabinetRef}>
              {studio.spotlight && <div className="bookcase-spotlight" aria-hidden="true" />}

              {studio.fairyLights && (
                <div className="fairy-lights-strand" aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span key={i} className="fairy-bulb" />
                  ))}
                </div>
              )}

              {filteredBooks.length === 0 ? (
                <div className="shelf-tier">
                  <div className="fullscreen-shelf-row">
                    <div className="shelf-empty-state">
                      No books match this filter yet. Try switching to All Books.
                    </div>
                  </div>
                  <div className={`wooden-plank wood-${studio.woodFinish}`} aria-hidden="true" />
                </div>
              ) : (
                tiers.map((rowUnits, tierIndex) => {
                  const leftProps = getPropsForTier(tierIndex, tiers.length, 'left');
                  const rightProps = getPropsForTier(tierIndex, tiers.length, 'right');

                  return (
                    <div className="shelf-tier" key={`fs-tier-${tierIndex}`}>
                      <div className="fullscreen-shelf-row">
                        {leftProps.length > 0 && (
                          <div className="shelf-props-side left">
                            {leftProps.map((p) => (
                              <React.Fragment key={p.id}>{renderShelfProp(p.id)}</React.Fragment>
                            ))}
                          </div>
                        )}

                        {rowUnits.map((unit) => {
                          if (unit.type === 'series') {
                            return renderSeriesGroup(unit);
                          }

                          if (unit.type === 'stack') {
                            return (
                              <div className="book-stack-column" key={`stack-${unit.items[0].book.id}`}>
                                {unit.items.map(({ book }) => {
                                  const offset = ((getBookHash(book) % 5) - 2) * 2;
                                  return (
                                    <div
                                      key={book.id}
                                      className={`shelf-book-slot ${draggedIds.includes(book.id) ? 'is-dragging' : ''} ${
                                        dragOverKey === book.id ? 'is-drag-over' : ''
                                      }`}
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, book.id)}
                                      onDragOver={(e) => handleDragOver(e, book.id)}
                                      onDrop={(e) => handleDrop(e, book.id)}
                                      onDragEnd={handleDragEnd}
                                    >
                                      {layout === 'curated' && (
                                        <button
                                          type="button"
                                          className="curated-style-pill"
                                          onClick={(e) => cycleBookStyle(e, book.id, 'stack')}
                                          title="Switch display style"
                                        >
                                          <Repeat size={9} />
                                          {STYLE_LABELS.stack}
                                        </button>
                                      )}
                                      {renderHorizontalBook(book, offset)}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          }

                          const { book } = unit;
                          const rating = Math.round(book.rating || 0);

                          if (unit.type === 'cover') {
                            return (
                              <div
                                key={book.id}
                                className={`shelf-book-slot ${draggedIds.includes(book.id) ? 'is-dragging' : ''} ${
                                  dragOverKey === book.id ? 'is-drag-over' : ''
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, book.id)}
                                onDragOver={(e) => handleDragOver(e, book.id)}
                                onDrop={(e) => handleDrop(e, book.id)}
                                onDragEnd={handleDragEnd}
                              >
                                {layout === 'curated' && (
                                  <button
                                    type="button"
                                    className="curated-style-pill"
                                    onClick={(e) => cycleBookStyle(e, book.id, 'cover')}
                                    title="Switch display style"
                                  >
                                    <Repeat size={9} />
                                    {STYLE_LABELS.cover}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="book-cover-shelf-btn"
                                  onClick={(e) => handleBookClick(e, book)}
                                  aria-label={`${book.title} by ${book.author}`}
                                >
                                  <BookCover
                                    coverUrl={book.coverUrl}
                                    title={book.title}
                                    author={book.author}
                                    genre={book.genre}
                                  />
                                  {renderTooltip(book, rating)}
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={book.id}
                              className={`shelf-book-slot ${draggedIds.includes(book.id) ? 'is-dragging' : ''} ${
                                dragOverKey === book.id ? 'is-drag-over' : ''
                              }`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, book.id)}
                              onDragOver={(e) => handleDragOver(e, book.id)}
                              onDrop={(e) => handleDrop(e, book.id)}
                              onDragEnd={handleDragEnd}
                            >
                              {layout === 'curated' && (
                                <button
                                  type="button"
                                  className="curated-style-pill"
                                  onClick={(e) => cycleBookStyle(e, book.id, 'spine')}
                                  title="Switch display style"
                                >
                                  <Repeat size={9} />
                                  {STYLE_LABELS.spine}
                                </button>
                              )}
                              {renderSpineButton(book)}
                            </div>
                          );
                        })}

                        {rightProps.length > 0 && (
                          <div className="shelf-props-side right">
                            {rightProps.map((p) => (
                              <React.Fragment key={p.id}>{renderShelfProp(p.id)}</React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={`wooden-plank wood-${studio.woodFinish}`} aria-hidden="true" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Customize Shelf & Props Studio Drawer */}
          {isStudioOpen && (
            <aside className="studio-drawer" aria-label="Customize Shelf and Props">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'var(--font-serif)' }}>
                  Shelf &amp; Props Studio
                </h3>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.45rem' }}
                  onClick={() => setStudio(DEFAULT_SHELF_STUDIO)}
                  title="Reset shelf customization"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>

              <div>
                <div className="studio-section-title">Wood Finish</div>
                <div className="wood-finish-grid">
                  {WOOD_FINISHES.map((wf) => (
                    <button
                      key={wf.id}
                      type="button"
                      className={`wood-swatch-btn ${studio.woodFinish === wf.id ? 'active' : ''}`}
                      onClick={() => setStudio((prev) => ({ ...prev, woodFinish: wf.id }))}
                    >
                      <span className="wood-swatch-chip" style={{ backgroundColor: wf.swatch }} />
                      <span>{wf.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="studio-section-title">Shelf Lighting</div>
                <label className="studio-toggle-row">
                  <span>Bookcase Spotlight</span>
                  <input
                    type="checkbox"
                    checked={!!studio.spotlight}
                    onChange={(e) => setStudio((prev) => ({ ...prev, spotlight: e.target.checked }))}
                  />
                </label>
                <label className="studio-toggle-row">
                  <span>Warm Fairy Lights</span>
                  <input
                    type="checkbox"
                    checked={!!studio.fairyLights}
                    onChange={(e) => setStudio((prev) => ({ ...prev, fairyLights: e.target.checked }))}
                  />
                </label>
              </div>

              <div>
                <div className="studio-section-title">Shelf Props</div>
                {PROP_CATALOG.map((meta) => {
                  const cfg = (studio.props || []).find((p) => p.id === meta.id) || {
                    id: meta.id,
                    enabled: false,
                    side: meta.defaultSide,
                    shelf: meta.defaultShelf
                  };
                  return (
                    <div className="studio-prop-row" key={meta.id}>
                      <label className="studio-prop-top">
                        <span>{meta.label}</span>
                        <input
                          type="checkbox"
                          checked={!!cfg.enabled}
                          onChange={(e) => updatePropConfig(meta.id, { enabled: e.target.checked })}
                        />
                      </label>
                      {cfg.enabled && (
                        <div className="studio-prop-controls">
                          <select
                            className="studio-mini-select"
                            value={cfg.shelf}
                            onChange={(e) => updatePropConfig(meta.id, { shelf: e.target.value })}
                          >
                            <option value="first">Top Shelf</option>
                            <option value="middle">Middle Shelf</option>
                            <option value="last">Bottom Shelf</option>
                          </select>
                          <select
                            className="studio-mini-select"
                            value={cfg.side}
                            onChange={(e) => updatePropConfig(meta.id, { side: e.target.value })}
                          >
                            <option value="left">Left Side</option>
                            <option value="right">Right Side</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
