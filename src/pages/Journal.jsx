import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import JournalModal from '../components/JournalModal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/dates';
import { MOOD_OPTIONS } from '../data/sampleData';
import {
  Feather,
  Quote,
  Plus,
  Search,
  BookOpen,
  Calendar,
  Trash2,
  Edit3,
  Copy,
  Check,
  Tag,
  Filter
} from 'lucide-react';

export default function Journal() {
  const {
    journal,
    deleteJournalEntry,
    books,
    deleteQuoteFromBook,
    showToast,
    setSelectedBook
  } = useLibrary();

  // Active view: 'entries' | 'quotes'
  const [activeSubTab, setActiveSubTab] = useState('entries');

  // Journal Search & Mood Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedBookFilter, setSelectedBookFilter] = useState('All');

  // Modal states
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);

  const [entryToDelete, setEntryToDelete] = useState(null);
  const [quoteToDelete, setQuoteToDelete] = useState(null);

  const [copiedQuoteId, setCopiedQuoteId] = useState(null);

  // Extract all quotes across all books
  const allQuotes = useMemo(() => {
    const list = [];
    books.forEach((book) => {
      if (book.quotes && Array.isArray(book.quotes)) {
        book.quotes.forEach((q) => {
          list.push({
            ...q,
            bookId: book.id,
            bookTitle: book.title,
            author: book.author,
            genre: book.genre
          });
        });
      }
    });
    return list;
  }, [books]);

  // Filtered Journal Entries
  const filteredEntries = useMemo(() => {
    return journal.filter((entry) => {
      if (selectedMood !== 'All' && entry.mood !== selectedMood) {
        return false;
      }
      if (selectedBookFilter !== 'All' && entry.bookId !== selectedBookFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = entry.title?.toLowerCase().includes(q);
        const matchContent = entry.content?.toLowerCase().includes(q);
        const matchTags = (entry.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchBook = entry.bookTitle?.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchTags && !matchBook) {
          return false;
        }
      }
      return true;
    });
  }, [journal, selectedMood, selectedBookFilter, searchQuery]);

  // Filtered Quotes
  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return allQuotes;
    const q = searchQuery.toLowerCase().trim();
    return allQuotes.filter(
      (item) =>
        item.text?.toLowerCase().includes(q) ||
        item.bookTitle?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q)
    );
  }, [allQuotes, searchQuery]);

  const handleCopyQuote = (quote) => {
    const textToCopy = `"${quote.text}" — ${quote.author}, ${quote.bookTitle}${
      quote.page ? ` (p. ${quote.page})` : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuoteId(quote.id);
    showToast('Quote copied to clipboard.');
    setTimeout(() => setCopiedQuoteId(null), 2500);
  };

  const getMoodColor = (moodName) => {
    const found = MOOD_OPTIONS.find((m) => m.label === moodName);
    return found ? found.color : 'var(--color-olive)';
  };

  return (
    <div className="journal-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.25rem',
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
            Reading Journal
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
            An intimate diary of reading atmospheres, personal musings, and literary keepsakes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Sub-tabs: Journal Entries vs Collectible Quotes */}
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
              onClick={() => setActiveSubTab('entries')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                fontWeight: activeSubTab === 'entries' ? 600 : 400,
                backgroundColor: activeSubTab === 'entries' ? 'var(--color-paper-card)' : 'transparent',
                color: activeSubTab === 'entries' ? 'var(--color-burgundy)' : 'var(--color-ink-muted)',
                boxShadow: activeSubTab === 'entries' ? 'var(--shadow-paper-sm)' : 'none'
              }}
            >
              <Feather size={15} />
              <span>Reflections ({journal.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('quotes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                fontWeight: activeSubTab === 'quotes' ? 600 : 400,
                backgroundColor: activeSubTab === 'quotes' ? 'var(--color-paper-card)' : 'transparent',
                color: activeSubTab === 'quotes' ? 'var(--color-burgundy)' : 'var(--color-ink-muted)',
                boxShadow: activeSubTab === 'quotes' ? 'var(--shadow-paper-sm)' : 'none'
              }}
            >
              <Quote size={15} />
              <span>Quotes ({allQuotes.length})</span>
            </button>
          </div>

          {activeSubTab === 'entries' && (
            <button
              type="button"
              onClick={() => {
                setEntryToEdit(null);
                setIsJournalModalOpen(true);
              }}
              className="btn-primary"
              style={{ fontSize: '0.86rem', padding: '0.55rem 1rem' }}
            >
              <Plus size={16} />
              <span>New Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
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
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
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
            placeholder={
              activeSubTab === 'entries'
                ? 'Search journal reflections, tags...'
                : 'Search quote passages, books...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.35rem' }}
          />
        </div>

        {activeSubTab === 'entries' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* Mood Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>Mood:</span>
              <select
                className="form-select"
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', width: 'auto' }}
              >
                <option value="All">All Moods</option>
                {MOOD_OPTIONS.map((m) => (
                  <option key={m.label} value={m.label}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>Book:</span>
              <select
                className="form-select"
                value={selectedBookFilter}
                onChange={(e) => setSelectedBookFilter(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', width: 'auto' }}
              >
                <option value="All">All Books</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: JOURNAL ENTRIES TIMELINE */}
      {activeSubTab === 'entries' && (
        <div>
          {filteredEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="paper-card"
                  style={{
                    padding: '1.75rem 2rem',
                    backgroundColor: 'var(--color-paper-light)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${getMoodColor(entry.mood)}`
                  }}
                >
                  {/* Entry Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.85rem'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.4rem',
                          fontSize: '0.78rem',
                          color: 'var(--color-ink-muted)'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} />
                          {formatDate(entry.date)}
                        </span>

                        <span
                          style={{
                            padding: '0.15rem 0.55rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            backgroundColor: 'var(--color-antique-paper)',
                            color: getMoodColor(entry.mood)
                          }}
                        >
                          {entry.mood}
                        </span>

                        {entry.bookTitle && (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              color: 'var(--color-burgundy)',
                              fontWeight: 500
                            }}
                          >
                            <BookOpen size={13} />
                            {entry.bookTitle}
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.45rem',
                          color: 'var(--color-espresso)',
                          margin: 0
                        }}
                      >
                        {entry.title}
                      </h3>
                    </div>

                    {/* Entry Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEntryToEdit(entry);
                          setIsJournalModalOpen(true);
                        }}
                        className="btn-ghost"
                        style={{ padding: '0.35rem' }}
                        title="Edit reflection"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntryToDelete(entry)}
                        className="btn-ghost"
                        style={{ padding: '0.35rem', color: '#8C3838' }}
                        title="Delete reflection"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.08rem',
                      lineHeight: 1.65,
                      color: 'var(--color-ink)',
                      margin: '0 0 1.15rem 0',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {entry.content}
                  </p>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.5rem',
                            backgroundColor: 'var(--color-antique-paper)',
                            color: 'var(--color-espresso-light)',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border-subtle)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reflections recorded yet"
              description="Open your thoughts and pen a quiet note about what you are reading today."
              actionText="Write a Reflection"
              onAction={() => {
                setEntryToEdit(null);
                setIsJournalModalOpen(true);
              }}
              icon={Feather}
            />
          )}
        </div>
      )}

      {/* VIEW 2: COLLECTIBLE QUOTE CARDS */}
      {activeSubTab === 'quotes' && (
        <div>
          {filteredQuotes.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="paper-card"
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--color-paper-light)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    <Quote
                      size={24}
                      color="var(--color-terracotta)"
                      style={{ opacity: 0.75, marginBottom: '0.65rem' }}
                    />
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.12rem',
                        lineHeight: 1.55,
                        fontStyle: 'italic',
                        color: 'var(--color-espresso)',
                        margin: '0 0 1rem 0'
                      }}
                    >
                      "{quote.text}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.35rem'
                      }}
                    >
                      <div>
                        <h4
                          onClick={() => {
                            const b = books.find((item) => item.id === quote.bookId);
                            if (b) setSelectedBook(b);
                          }}
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '0.98rem',
                            fontWeight: 600,
                            color: 'var(--color-burgundy)',
                            margin: 0,
                            cursor: 'pointer'
                          }}
                        >
                          {quote.bookTitle}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                          by {quote.author} {quote.page ? `• p. ${quote.page}` : ''}
                        </span>
                      </div>

                      {/* Copy & Delete */}
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          onClick={() => handleCopyQuote(quote)}
                          className="btn-ghost"
                          style={{ padding: '0.25rem' }}
                          title="Copy quote"
                        >
                          {copiedQuoteId === quote.id ? (
                            <Check size={14} color="var(--color-olive)" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuoteToDelete(quote)}
                          className="btn-ghost"
                          style={{ padding: '0.25rem', color: '#8C3838' }}
                          title="Delete quote"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {quote.note && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-terracotta)',
                          fontStyle: 'italic',
                          margin: '0.4rem 0 0 0'
                        }}
                      >
                        Note: {quote.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No quotes collected"
              description="Open any book on your shelf to add memorable lines and passages."
              actionText="Browse Books"
              onAction={() => setActiveSubTab('entries')}
              icon={Quote}
            />
          )}
        </div>
      )}

      {/* Journal Modal for Add/Edit */}
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => {
          setIsJournalModalOpen(false);
          setEntryToEdit(null);
        }}
        entryToEdit={entryToEdit}
      />

      {/* Confirm Delete Journal Entry */}
      <ConfirmModal
        isOpen={Boolean(entryToDelete)}
        title="Delete Journal Entry?"
        message={`Are you sure you want to delete "${entryToDelete?.title}"? This reflection will be permanently erased.`}
        confirmText="Delete Entry"
        cancelText="Keep"
        onConfirm={() => {
          if (entryToDelete) deleteJournalEntry(entryToDelete.id);
          setEntryToDelete(null);
        }}
        onCancel={() => setEntryToDelete(null)}
      />

      {/* Confirm Delete Quote */}
      <ConfirmModal
        isOpen={Boolean(quoteToDelete)}
        title="Remove Saved Quote?"
        message="Remove this quote from your collectible literary keepsakes?"
        confirmText="Remove Quote"
        cancelText="Keep"
        onConfirm={() => {
          if (quoteToDelete) deleteQuoteFromBook(quoteToDelete.bookId, quoteToDelete.id);
          setQuoteToDelete(null);
        }}
        onCancel={() => setQuoteToDelete(null)}
      />
    </div>
  );
}
