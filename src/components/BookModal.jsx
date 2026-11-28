import React, { useState, useEffect, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { GENRE_OPTIONS } from '../data/sampleData';
import { getTodayDateString } from '../utils/dates';
import { searchOpenLibrary, mapSubjectToGenre, fetchBookDetails } from '../utils/bookApi';
import { X, Star, Image, BookOpen, Bookmark, Search, Sparkles, Loader2 } from 'lucide-react';

const PRESET_COVERS = [
  { label: 'Leather Spine', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Antique Botanical', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dark Academia', url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80' },
  { label: 'Linen Notebook', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80' },
  { label: 'Vintage Gold', url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80' }
];

export default function BookModal({ isOpen, onClose, bookToEdit = null }) {
  const { addBook, updateBook, shelves = [], addCustomShelf } = useLibrary();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverUrl: '',
    genre: 'Classic Romance',
    description: '',
    totalPages: 300,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    review: '',
    dateStarted: '',
    dateFinished: '',
    tagsString: '',
    shelves: [],
    series: { name: '', number: '', total: '' }
  });

  const [newShelfInput, setNewShelfInput] = useState('');

  const [errors, setErrors] = useState({});

  // Open Library Auto-fill states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const detailsRequestIdRef = useRef(0);

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        coverUrl: bookToEdit.coverUrl || '',
        genre: bookToEdit.genre || 'Classic Romance',
        description: bookToEdit.description || '',
        totalPages: bookToEdit.totalPages || 300,
        currentPage: bookToEdit.currentPage || 0,
        status: bookToEdit.status || 'want-to-read',
        rating: bookToEdit.rating || 0,
        review: bookToEdit.review || '',
        dateStarted: bookToEdit.dateStarted || '',
        dateFinished: bookToEdit.dateFinished || '',
        tagsString: (bookToEdit.tags || []).join(', '),
        shelves: Array.isArray(bookToEdit.shelves) ? bookToEdit.shelves : [],
        series: {
          name: bookToEdit.series?.name || '',
          number: bookToEdit.series?.number !== undefined && bookToEdit.series?.number !== null ? bookToEdit.series.number : '',
          total: bookToEdit.series?.total !== undefined && bookToEdit.series?.total !== null ? bookToEdit.series.total : ''
        }
      });
    } else {
      setFormData({
        title: '',
        author: '',
        coverUrl: '',
        genre: 'Classic Romance',
        description: '',
        totalPages: 300,
        currentPage: 0,
        status: 'want-to-read',
        rating: 0,
        review: '',
        dateStarted: '',
        dateFinished: '',
        tagsString: '',
        shelves: [],
        series: { name: '', number: '', total: '' }
      });
    }
    setNewShelfInput('');
    setErrors({});
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchError(null);
    setHasSearched(false);
    setLastSearchedQuery('');
    setIsFetchingDetails(false);
    detailsRequestIdRef.current += 1;
  }, [bookToEdit, isOpen]);

  const handleSearch = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(false);
    setLastSearchedQuery(trimmed);

    try {
      const results = await searchOpenLibrary(trimmed);
      setSearchResults(results);
      setHasSearched(true);
    } catch (err) {
      console.error('Open Library search failed:', err);
      setSearchError('Unable to connect to Open Library archives. Please check your connection or fill in details manually.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = async (selected) => {
    const selectedGenre = selected.genre || mapSubjectToGenre(selected.subjects || selected.subject);

    setFormData((prev) => ({
      ...prev,
      title: selected.title ? selected.title : prev.title,
      author: selected.author ? selected.author : prev.author,
      totalPages: (selected.totalPages && Number(selected.totalPages) > 0)
        ? Number(selected.totalPages)
        : prev.totalPages,
      coverUrl: selected.coverUrl ? selected.coverUrl : prev.coverUrl,
      genre: selectedGenre ? selectedGenre : prev.genre
    }));

    setErrors((prevErrors) => {
      const updated = { ...prevErrors };
      if (selected.title) delete updated.title;
      if (selected.author) delete updated.author;
      if (selected.totalPages) delete updated.totalPages;
      return updated;
    });

    setSearchResults([]);
    setHasSearched(false);
    setSearchError(null);

    const requestId = ++detailsRequestIdRef.current;
    setIsFetchingDetails(true);

    try {
      const details = await fetchBookDetails(selected);
      if (detailsRequestIdRef.current !== requestId || !details) return;

      setFormData((prev) => {
        const nextDescription =
          !prev.description.trim() && details.description
            ? details.description
            : prev.description;

        const nextSeriesName =
          !prev.series.name.trim() && details.seriesName
            ? details.seriesName
            : prev.series.name;

        const hasExistingNumber =
          prev.series.number !== '' &&
          prev.series.number !== null &&
          prev.series.number !== undefined;
        const hasFetchedNumber =
          details.seriesNumber !== '' &&
          details.seriesNumber !== null &&
          details.seriesNumber !== undefined;
        const nextSeriesNumber =
          !hasExistingNumber && hasFetchedNumber
            ? String(details.seriesNumber)
            : prev.series.number;

        return {
          ...prev,
          description: nextDescription,
          series: {
            ...prev.series,
            name: nextSeriesName,
            number: nextSeriesNumber
          }
        };
      });
    } catch {
      // Silently ignore detail fetch errors so basic auto-fill remains intact
    } finally {
      if (detailsRequestIdRef.current === requestId) {
        setIsFetchingDetails(false);
      }
    }
  };

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a book title.';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Please enter an author name.';
    }
    const total = Number(formData.totalPages);
    const current = Number(formData.currentPage);

    if (isNaN(total) || total <= 0) {
      newErrors.totalPages = 'Total pages must be at least 1.';
    }
    if (isNaN(current) || current < 0) {
      newErrors.currentPage = 'Current page cannot be negative.';
    } else if (current > total) {
      newErrors.currentPage = 'Current page cannot exceed total pages.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const bookPayload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      coverUrl: formData.coverUrl.trim(),
      genre: formData.genre,
      description: formData.description.trim(),
      totalPages: Number(formData.totalPages),
      currentPage: Number(formData.currentPage),
      status: formData.status,
      rating: Number(formData.rating),
      review: formData.review.trim(),
      dateStarted: formData.dateStarted,
      dateFinished: formData.dateFinished,
      tags,
      shelves: formData.shelves,
      series: formData.series.name.trim()
        ? {
            name: formData.series.name.trim(),
            number: formData.series.number !== '' ? Number(formData.series.number) || formData.series.number : '',
            total: formData.series.total !== '' ? Number(formData.series.total) || formData.series.total : ''
          }
        : null,
      rereads: bookToEdit?.rereads || []
    };

    // Auto-complete rules
    if (bookPayload.status === 'completed') {
      bookPayload.currentPage = bookPayload.totalPages;
      if (!bookPayload.dateFinished) {
        bookPayload.dateFinished = getTodayDateString();
      }
    }

    if (bookToEdit) {
      updateBook(bookToEdit.id, bookPayload);
    } else {
      addBook(bookPayload);
    }

    onClose();
  };

  const handleStatusChange = (newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === 'completed') {
      updates.currentPage = formData.totalPages;
      if (!formData.dateFinished) {
        updates.dateFinished = getTodayDateString();
      }
    } else if (newStatus === 'currently-reading' && !formData.dateStarted) {
      updates.dateStarted = getTodayDateString();
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleShelf = (shelfName) => {
    setFormData((prev) => {
      const exists = prev.shelves.includes(shelfName);
      return {
        ...prev,
        shelves: exists
          ? prev.shelves.filter((s) => s !== shelfName)
          : [...prev.shelves, shelfName]
      };
    });
  };

  const handleAddNewShelf = (e) => {
    if (e) e.preventDefault();
    const trimmed = newShelfInput.trim();
    if (!trimmed) return;
    if (!shelves.includes(trimmed)) {
      addCustomShelf(trimmed);
    }
    if (!formData.shelves.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        shelves: [...prev.shelves, trimmed]
      }));
    }
    setNewShelfInput('');
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
      onClick={onClose}
    >
      <div
        className="paper-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--color-paper-light)',
          border: '1px solid var(--color-border-warm)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-paper-lg)',
          padding: '2rem 2.25rem',
          animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.85rem'
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.25rem 0'
              }}
            >
              {bookToEdit ? 'Edit Volume' : 'Add to Your Collection'}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.88rem',
                color: 'var(--color-ink-muted)',
                margin: 0
              }}
            >
              Record the story, its cover, and your personal impressions.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Auto-fill Metadata by Title or ISBN (Add Mode Only) */}
        {!bookToEdit && (
          <div className="book-lookup-box">
            <div className="book-lookup-header">
              <label htmlFor="open-library-lookup" className="book-lookup-title">
                <Sparkles size={14} style={{ color: 'var(--color-burgundy)' }} />
                Auto-fill by Title or ISBN
              </label>
              <span className="book-lookup-subtitle">
                Powered by Open Library archives
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  id="open-library-lookup"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', paddingRight: searchQuery ? '2rem' : '0.85rem' }}
                  placeholder="e.g. Pride and Prejudice, The Hobbit, or 9780141439518..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchError) setSearchError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSearch();
                    }
                  }}
                />
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-ink-faint)',
                    pointerEvents: 'none'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setHasSearched(false);
                      setSearchError(null);
                    }}
                    style={{
                      position: 'absolute',
                      right: '0.6rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '0.2rem',
                      color: 'var(--color-ink-faint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="btn-primary"
                style={{
                  padding: '0.6rem 1.15rem',
                  fontSize: '0.84rem',
                  whiteSpace: 'nowrap',
                  opacity: (isSearching || !searchQuery.trim()) ? 0.65 : 1,
                  cursor: (isSearching || !searchQuery.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSearching ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="book-lookup-loading">
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-burgundy)' }} />
                <span>Consulting the Open Library archives...</span>
              </div>
            )}

            {/* Extended Details Loading Indicator */}
            {!isSearching && isFetchingDetails && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginTop: '0.55rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: 'var(--color-ink-muted)'
                }}
              >
                <Loader2 size={13} className="animate-spin" style={{ color: 'var(--color-burgundy)' }} />
                <span>Fetching synopsis &amp; series info...</span>
              </div>
            )}

            {/* Error State */}
            {!isSearching && searchError && (
              <div className="book-lookup-error">
                <span>{searchError}</span>
                <button
                  type="button"
                  onClick={() => setSearchError(null)}
                  style={{ color: 'var(--color-espresso-light)', padding: '0.2rem', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Empty Results State */}
            {!isSearching && hasSearched && !searchError && searchResults.length === 0 && (
              <div className="book-lookup-empty">
                No matching volumes found for &ldquo;{lastSearchedQuery}&rdquo;. You may continue by entering the book details below.
              </div>
            )}

            {/* Search Results Dropdown List */}
            {!isSearching && searchResults.length > 0 && (
              <div className="book-search-dropdown">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.85rem',
                  backgroundColor: 'var(--color-antique-paper)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-espresso)'
                }}>
                  <span>Found {searchResults.length} Edition{searchResults.length === 1 ? '' : 's'} &bull; Click to Auto-fill</span>
                  <button
                    type="button"
                    onClick={() => setSearchResults([])}
                    style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </div>

                <div>
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleSelectBook(book)}
                      className="book-search-result-row"
                    >
                      {/* Thumbnail Cover */}
                      <div style={{
                        width: '36px',
                        height: '50px',
                        flexShrink: 0,
                        borderRadius: '2px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--color-antique-paper)',
                        border: '1px solid var(--color-border-warm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <BookOpen size={16} style={{ color: 'var(--color-ink-faint)' }} />
                        )}
                      </div>

                      {/* Metadata Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-serif)',
                          fontWeight: 600,
                          fontSize: '0.96rem',
                          color: 'var(--color-espresso)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {book.title || 'Untitled'}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: '0.84rem',
                          color: 'var(--color-ink-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {book.author ? `by ${book.author}` : 'Unknown Author'}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.2rem',
                          fontSize: '0.74rem',
                          color: 'var(--color-ink-faint)',
                          flexWrap: 'wrap'
                        }}>
                          {book.publishYear && (
                            <span>{book.publishYear}</span>
                          )}
                          {book.totalPages && (
                            <span>&bull; {book.totalPages} pages</span>
                          )}
                          {book.genre && (
                            <span className="book-badge genre-badge" style={{ padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}>
                              {book.genre}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick fill button */}
                      <span
                        className="btn-outline"
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.25rem 0.55rem',
                          flexShrink: 0,
                          color: 'var(--color-burgundy)',
                          borderColor: 'var(--color-burgundy-light)'
                        }}
                      >
                        Auto-fill
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            {/* Title */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Pride and Prejudice"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            {/* Author */}
            <div className="form-group">
              <label className="form-label">Author *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jane Austen"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
              {errors.author && <div className="form-error">{errors.author}</div>}
            </div>

            {/* Genre */}
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select
                className="form-select"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              >
                {GENRE_OPTIONS.filter((g) => g !== 'All Genres').map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Series Tracking (Optional) */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Series (Optional)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Series Name (e.g. The Lord of the Rings)"
                  value={formData.series.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      series: { ...prev.series, name: e.target.value }
                    }))
                  }
                />
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Book #"
                  value={formData.series.number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      series: { ...prev.series, number: e.target.value }
                    }))
                  }
                />
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Total in Series"
                  value={formData.series.total}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      series: { ...prev.series, total: e.target.value }
                    }))
                  }
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Cover Image URL (Optional)</label>
                <span className="form-hint">Leave blank for bespoke editorial cover</span>
              </div>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/cover.jpg"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              />

              {/* Preset Cover Suggestions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-ink-faint)' }}>Presets:</span>
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, coverUrl: preset.url })}
                    className="btn-outline"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Status */}
            <div className="form-group">
              <label className="form-label">Reading Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="want-to-read">Want to Read</option>
                <option value="currently-reading">Currently Reading</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            {/* Rating */}
            <div className="form-group">
              <label className="form-label">Your Rating (1-5)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', paddingTop: '0.4rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star === formData.rating ? 0 : star })}
                    style={{ padding: '0.2rem', color: star <= formData.rating ? '#C28B47' : 'var(--color-border-warm)' }}
                  >
                    <Star
                      size={20}
                      fill={star <= formData.rating ? '#C28B47' : 'none'}
                      stroke={star <= formData.rating ? '#C28B47' : 'var(--color-border-dark)'}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span style={{ fontSize: '0.84rem', color: 'var(--color-espresso)', marginLeft: '0.5rem', fontWeight: 600 }}>
                    {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                )}
              </div>
            </div>

            {/* Total Pages */}
            <div className="form-group">
              <label className="form-label">Total Pages *</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={formData.totalPages}
                onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
              />
              {errors.totalPages && <div className="form-error">{errors.totalPages}</div>}
            </div>

            {/* Current Page */}
            <div className="form-group">
              <label className="form-label">Current Page</label>
              <input
                type="number"
                min="0"
                max={formData.totalPages}
                className="form-input"
                value={formData.currentPage}
                onChange={(e) => setFormData({ ...formData, currentPage: e.target.value })}
              />
              {errors.currentPage && <div className="form-error">{errors.currentPage}</div>}
            </div>

            {/* Date Started */}
            <div className="form-group">
              <label className="form-label">Date Started</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateStarted}
                onChange={(e) => setFormData({ ...formData, dateStarted: e.target.value })}
              />
            </div>

            {/* Date Finished */}
            <div className="form-group">
              <label className="form-label">Date Finished</label>
              <input
                type="date"
                className="form-input"
                value={formData.dateFinished}
                onChange={(e) => setFormData({ ...formData, dateFinished: e.target.value })}
              />
            </div>

            {/* Custom Shelves */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Custom Shelves</label>
                <span className="form-hint">Assign to your curated collections</span>
              </div>

              {/* Shelf Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.65rem' }}>
                {shelves.map((shelf) => {
                  const isSelected = formData.shelves.includes(shelf);
                  return (
                    <button
                      key={shelf}
                      type="button"
                      onClick={() => toggleShelf(shelf)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 600 : 400,
                        backgroundColor: isSelected ? 'var(--color-burgundy)' : 'var(--color-antique-paper)',
                        color: isSelected ? '#FAF7F2' : 'var(--color-espresso)',
                        border: isSelected
                          ? '1px solid var(--color-burgundy)'
                          : '1px solid var(--color-border-warm)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span>{isSelected ? '✓ ' : '+ '}{shelf}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add New Shelf Inline */}
              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '340px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="New shelf name..."
                  value={newShelfInput}
                  onChange={(e) => setNewShelfInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewShelf();
                    }
                  }}
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddNewShelf}
                  className="btn-outline"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', flexShrink: 0 }}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Personal Tags (Comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Victorian, Comfort Read, Autumn TBR"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Book Synopsis / Description</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="A brief overview of the plot or themes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Personal Review */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Personal Thoughts &amp; Review</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="How did this book make you feel? What lingered after you closed it?"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.85rem',
              marginTop: '1.5rem',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '1.25rem'
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {bookToEdit ? 'Save Changes' : 'Add to Bookshelf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
