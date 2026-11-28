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
  BookX,
  Trash2,
  Folder
} from 'lucide-react';

export default function Bookshelf() {
  const { books, setIsAddBookModalOpen, shelves = [], addCustomShelf, deleteCustomShelf } = useLibrary();

  // Display mode: 'grid' | 'list'
  const [viewMode, setViewMode] = useState('grid');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('All Genres');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [shelfFilter, setShelfFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent-added');

  // Manage Shelves Modal
  const [isManageShelvesOpen, setIsManageShelvesOpen] = useState(false);
  const [newShelfModalInput, setNewShelfModalInput] = useState('');

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

        // Shelf filter
        if (shelfFilter !== 'all' && (!book.shelves || !book.shelves.includes(shelfFilter))) {
          return false;
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
  }, [books, statusFilter, genreFilter, ratingFilter, shelfFilter, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenreFilter('All Genres');
    setRatingFilter('all');
    setShelfFilter('all');
    setSortBy('recent-added');
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'all' ||
    genreFilter !== 'All Genres' ||
    ratingFilter !== 'all' ||
    shelfFilter !== 'all';

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
                backgroundColor: viewMode === 'grid' ? 'var(--color-paper-card)' : 'transparent',
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
                backgroundColor: viewMode === 'list' ? 'var(--color-paper-card)' : 'transparent',
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
              className={isActive ? 'status-filter-pill active' : 'status-filter-pill'}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.84rem',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label} <span style={{ opacity: 0.75, fontSize: '0.78rem' }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Custom Shelves Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.2rem',
          scrollbarWidth: 'none'
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--color-ink-muted)',
            marginRight: '0.2rem',
            whiteSpace: 'nowrap'
          }}
        >
          Shelves:
        </span>
        <button
          type="button"
          onClick={() => setShelfFilter('all')}
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: shelfFilter === 'all' ? 600 : 400,
            backgroundColor: shelfFilter === 'all' ? 'var(--color-espresso)' : 'var(--color-paper-light)',
            color: shelfFilter === 'all' ? '#FAF7F2' : 'var(--color-espresso)',
            border: shelfFilter === 'all' ? '1px solid var(--color-espresso)' : '1px solid var(--color-border-warm)',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
        >
          All Shelves
        </button>
        {shelves.map((shelf) => {
          const isActive = shelfFilter === shelf;
          const count = books.filter((b) => b.shelves && b.shelves.includes(shelf)).length;
          return (
            <button
              key={shelf}
              type="button"
              onClick={() => setShelfFilter(isActive ? 'all' : shelf)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? 'var(--color-burgundy)' : 'var(--color-paper-light)',
                color: isActive ? '#FAF7F2' : 'var(--color-espresso)',
                border: isActive ? '1px solid var(--color-burgundy)' : '1px solid var(--color-border-warm)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <span>{shelf}</span>
              <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>({count})</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setIsManageShelvesOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.35rem 0.7rem',
            borderRadius: '999px',
            fontSize: '0.76rem',
            backgroundColor: 'transparent',
            color: 'var(--color-burgundy)',
            border: '1px dashed var(--color-border-warm)',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
          title="Create or manage custom shelves"
        >
          <Plus size={13} />
          <span>New / Manage</span>
        </button>
      </div>

      {/* Search & Secondary Filters Bar */}
      <div
        className="paper-card"
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--color-paper-light)',
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

          {/* Shelf select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>Shelf:</span>
            <select
              className="form-select"
              value={shelfFilter}
              onChange={(e) => setShelfFilter(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', width: 'auto' }}
            >
              <option value="all">All Shelves</option>
              {shelves.map((s) => (
                <option key={s} value={s}>
                  {s}
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
      {/* Manage Shelves Modal */}
      {isManageShelvesOpen && (
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
          onClick={() => setIsManageShelvesOpen(false)}
        >
          <div
            className="paper-card"
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'var(--color-paper-light)',
              border: '1px solid var(--color-border-warm)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-paper-lg)',
              padding: '1.75rem',
              animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--color-border-subtle)',
                paddingBottom: '0.75rem'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--color-espresso)',
                  margin: 0
                }}
              >
                Manage Custom Shelves
              </h3>
              <button
                type="button"
                onClick={() => setIsManageShelvesOpen(false)}
                className="btn-ghost"
                style={{ padding: '0.35rem' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Create New Shelf Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = newShelfModalInput.trim();
                if (trimmed) {
                  addCustomShelf(trimmed);
                  setNewShelfModalInput('');
                }
              }}
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Enter new shelf title..."
                value={newShelfModalInput}
                onChange={(e) => setNewShelfModalInput(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn-primary" style={{ flexShrink: 0, fontSize: '0.82rem' }}>
                <Plus size={14} />
                <span>Create</span>
              </button>
            </form>

            {/* Shelf List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' }}>
              {shelves.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-ink-muted)', padding: '1rem', fontStyle: 'italic', fontSize: '0.86rem' }}>
                  No custom shelves yet.
                </div>
              ) : (
                shelves.map((shelf) => {
                  const bookCount = books.filter((b) => b.shelves && b.shelves.includes(shelf)).length;
                  return (
                    <div
                      key={shelf}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.55rem 0.85rem',
                        backgroundColor: 'var(--color-antique-paper)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-espresso)' }}>
                          {shelf}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)', marginLeft: '0.5rem' }}>
                          ({bookCount} volume{bookCount === 1 ? '' : 's'})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete shelf "${shelf}"? Books in this shelf will remain in your library.`)) {
                            deleteCustomShelf(shelf);
                            if (shelfFilter === shelf) {
                              setShelfFilter('all');
                            }
                          }
                        }}
                        className="btn-ghost"
                        style={{ color: '#8C3838', padding: '0.25rem' }}
                        title="Delete shelf"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setIsManageShelvesOpen(false)}
                className="btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
