import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import { GENRE_OPTIONS } from '../data/sampleData';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  X,
  Plus,
  BookOpen,
  ArrowUpDown,
  BookX
} from 'lucide-react';

export default function Bookshelf() {
  const { books, setIsAddBookModalOpen } = useLibrary();

  // Display mode: 'grid' | 'list'
  const [viewMode, setViewMode] = useState('grid');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('All Genres');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent-added');

  const statusTabs = [
    { id: 'all', label: 'All Volumes' },
    { id: 'currently-reading', label: 'Currently Reading' },
    { id: 'want-to-read', label: 'Want to Read' },
    { id: 'completed', label: 'Completed' },
    { id: 'on-hold', label: 'On Hold' },
    { id: 'abandoned', label: 'Abandoned' }
  ];

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Status filter
        if (statusFilter !== 'all' && book.status !== statusFilter) {
          return false;
        }

        // Genre filter
        if (genreFilter !== 'All Genres' && book.genre !== genreFilter) {
          return false;
        }

        // Rating filter
        if (ratingFilter !== 'all') {
          const r = Number(book.rating) || 0;
          if (ratingFilter === '5' && r < 5) return false;
          if (ratingFilter === '4+' && r < 4) return false;
          if (ratingFilter === '3+' && r < 3) return false;
          if (ratingFilter === 'unrated' && r > 0) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = book.title?.toLowerCase().includes(query);
          const matchAuthor = book.author?.toLowerCase().includes(query);
          const matchGenre = book.genre?.toLowerCase().includes(query);
          const matchTags = (book.tags || []).some((tag) =>
            tag.toLowerCase().includes(query)
          );
          if (!matchTitle && !matchAuthor && !matchGenre && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'author-asc') {
          return a.author.localeCompare(b.author);
        }
        if (sortBy === 'highest-rated') {
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        }
        if (sortBy === 'recently-completed') {
          const dateA = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
          const dateB = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;
          return dateB - dateA;
        }
        // default: recently added (by id or order)
        return 0;
      });
  }, [books, statusFilter, genreFilter, ratingFilter, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenreFilter('All Genres');
    setRatingFilter('all');
    setSortBy('recent-added');
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'all' ||
    genreFilter !== 'All Genres' ||
    ratingFilter !== 'all';

  return (
    <div className="bookshelf-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--color-border-warm)',
          paddingBottom: '1.25rem'
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
            My Bookshelf
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
            A curated personal library of stories, memories, and beloved editions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Display Mode Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-antique-paper)',
              padding: '0.2rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-warm)'
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: viewMode === 'grid' ? 600 : 400,
                backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'grid' ? 'var(--color-burgundy)' : 'var(--color-ink-muted)',
                boxShadow: viewMode === 'grid' ? 'var(--shadow-paper-sm)' : 'none'
              }}
              title="Bookshelf / Grid View"
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: viewMode === 'list' ? 600 : 400,
                backgroundColor: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'list' ? 'var(--color-burgundy)' : 'var(--color-ink-muted)',
                boxShadow: viewMode === 'list' ? 'var(--shadow-paper-sm)' : 'none'
              }}
              title="List View"
            >
              <List size={15} />
              <span>List</span>
            </button>
          </div>

          {/* Add a Book Button */}
          <button
            type="button"
            onClick={() => setIsAddBookModalOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.86rem', padding: '0.55rem 1rem' }}
          >
            <Plus size={16} />
            <span>Add Volume</span>
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.4rem',
          scrollbarWidth: 'none'
        }}
      >
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          const count =
            tab.id === 'all'
              ? books.length
              : books.filter((b) => b.status === tab.id).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? 'var(--color-burgundy)' : 'rgba(237, 228, 213, 0.45)',
                color: isActive ? '#FAF7F2' : 'var(--color-espresso)',
                border: isActive
                  ? '1px solid var(--color-burgundy)'
                  : '1px solid var(--color-border-subtle)',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label} <span style={{ opacity: 0.75, fontSize: '0.78rem' }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filters Bar */}
      <div
        className="paper-card"
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-ink-muted)'
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search title, author, genre, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.35rem', paddingRight: searchQuery ? '2.2rem' : '0.85rem' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-ink-muted)',
                padding: '0.2rem'
              }}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filters & Sorter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Genre select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>Genre:</span>
            <select
              className="form-select"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', width: 'auto' }}
            >
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Rating select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>Rating:</span>
            <select
              className="form-select"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', width: 'auto' }}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4+">4+ Stars</option>
              <option value="3+">3+ Stars</option>
              <option value="unrated">Unrated</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={14} color="var(--color-ink-muted)" />
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', width: 'auto' }}
            >
              <option value="recent-added">Recently Added</option>
              <option value="title-asc">Title A–Z</option>
              <option value="author-asc">Author A–Z</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="recently-completed">Recently Completed</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem', color: 'var(--color-terracotta)' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Book Grid / List View */}
      {filteredBooks.length > 0 ? (
        viewMode === 'grid' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} viewMode="list" />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          title={searchQuery ? 'No volumes match your search' : 'No books found in this section'}
          description={
            searchQuery
              ? `We couldn't find any titles, authors or tags matching "${searchQuery}".`
              : 'Add your first volume to this shelf or clear existing filters.'
          }
          actionText={hasActiveFilters ? 'Clear Filters' : 'Add a Book'}
          onAction={hasActiveFilters ? clearAllFilters : () => setIsAddBookModalOpen(true)}
          icon={searchQuery ? BookX : BookOpen}
        />
      )}
    </div>
  );
}
