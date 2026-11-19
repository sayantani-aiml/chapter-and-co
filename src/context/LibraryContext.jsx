import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  getInitialLibraryState,
  saveStoredData,
  STORAGE_KEYS,
  exportLibraryAsJSON,
  validateImportedJSON,
  clearAllLibraryStorage
} from '../utils/storage';
import {
  INITIAL_BOOKS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_READING_SESSIONS,
  INITIAL_ANNUAL_GOAL
} from '../data/sampleData';
import { getTodayDateString } from '../utils/dates';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [initialData] = useState(() => getInitialLibraryState());

  const [books, setBooks] = useState(initialData.books);
  const [journal, setJournal] = useState(initialData.journal);
  const [sessions, setSessions] = useState(initialData.sessions);
  const [goal, setGoal] = useState(initialData.goal);
  const [profile, setProfile] = useState(initialData.profile);

  // Active navigation view: 'home' | 'bookshelf' | 'journal' | 'statistics' | 'goals'
  const [activeTab, setActiveTab] = useState('home');

  // Modals
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isLogSessionModalOpen, setIsLogSessionModalOpen] = useState(false);
  const [sessionTargetBook, setSessionTargetBook] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.BOOKS, books);
  }, [books]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.JOURNAL, journal);
  }, [journal]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.SESSIONS, sessions);
  }, [sessions]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.GOAL, goal);
  }, [goal]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.USER_PROFILE, profile);
  }, [profile]);

  // Keep selectedBook updated if books list changes
  useEffect(() => {
    if (selectedBook) {
      const refreshed = books.find(b => b.id === selectedBook.id);
      if (refreshed) {
        setSelectedBook(refreshed);
      }
    }
  }, [books]);

  // Confetti celebration helper
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#713D46', '#899581', '#C89D9B', '#B97861', '#45372F']
      });
    } catch {
      // Fallback if canvas-confetti is not supported
    }
  };

  // --- BOOK CRUD ---
  const addBook = (bookData) => {
    const id = 'book-' + Date.now();
    const newBook = {
      ...bookData,
      id,
      currentPage: Number(bookData.currentPage) || 0,
      totalPages: Number(bookData.totalPages) || 1,
      quotes: bookData.quotes || [],
      tags: bookData.tags || [],
      rating: Number(bookData.rating) || 0,
      status: bookData.status || 'want-to-read'
    };

    if (newBook.status === 'completed' && !newBook.dateFinished) {
      newBook.dateFinished = getTodayDateString();
      newBook.currentPage = newBook.totalPages;
    }

    setBooks(prev => [newBook, ...prev]);
    showToast(`Added "${newBook.title}" to your bookshelf.`);
    return newBook;
  };

  const updateBook = (id, updatedFields) => {
    setBooks(prev =>
      prev.map(book => {
        if (book.id !== id) return book;
        const merged = { ...book, ...updatedFields };

        // Handle completed edge cases
        if (merged.status === 'completed' && book.status !== 'completed') {
          if (!merged.dateFinished) merged.dateFinished = getTodayDateString();
          merged.currentPage = merged.totalPages;
          triggerCelebration();
        }

        return merged;
      })
    );
    showToast('Book details updated.');
  };

  const deleteBook = (id) => {
    const bookToDelete = books.find(b => b.id === id);
    setBooks(prev => prev.filter(b => b.id !== id));
    if (selectedBook && selectedBook.id === id) {
      setSelectedBook(null);
    }
    showToast(
      bookToDelete ? `Removed "${bookToDelete.title}" from library.` : 'Book deleted.'
    );
  };

  const updateBookProgress = (id, newPage) => {
    const pageNum = Math.max(0, Number(newPage) || 0);
    setBooks(prev =>
      prev.map(book => {
        if (book.id !== id) return book;
        const boundedPage = Math.min(pageNum, book.totalPages);
        const isNowCompleted = boundedPage >= book.totalPages;

        if (isNowCompleted && book.status !== 'completed') {
          triggerCelebration();
          showToast(`Congratulations! You've finished "${book.title}"! 🎉`);
          return {
            ...book,
            currentPage: book.totalPages,
            status: 'completed',
            dateFinished: book.dateFinished || getTodayDateString()
          };
        }

        const newStatus =
          boundedPage > 0 && book.status === 'want-to-read'
            ? 'currently-reading'
            : book.status;

        return {
          ...book,
          currentPage: boundedPage,
          status: newStatus
        };
      })
    );
  };

  // --- LOG READING SESSION ---
  const logReadingSession = ({ bookId, pagesRead, minutes, date }) => {
    const book = books.find(b => b.id === bookId);
    const session = {
      id: 'session-' + Date.now(),
      date: date || getTodayDateString(),
      bookId: bookId || null,
      bookTitle: book ? book.title : '',
      pagesRead: Number(pagesRead) || 0,
      minutes: Number(minutes) || 0
    };

    setSessions(prev => [session, ...prev]);

    // Update book current page if provided
    if (book && session.pagesRead > 0) {
      const newPage = (Number(book.currentPage) || 0) + session.pagesRead;
      updateBookProgress(book.id, newPage);
    }

    showToast(`Logged ${pagesRead || 0} pages of quiet reading.`);
  };

  // --- QUOTES ---
  const addQuoteToBook = (bookId, quoteData) => {
    const newQuote = {
      id: 'q-' + Date.now(),
      text: quoteData.text,
      page: quoteData.page ? Number(quoteData.page) : '',
      dateAdded: getTodayDateString(),
      note: quoteData.note || ''
    };

    setBooks(prev =>
      prev.map(book => {
        if (book.id !== bookId) return book;
        return {
          ...book,
          quotes: [newQuote, ...(book.quotes || [])]
        };
      })
    );
    showToast('Quote saved to your keepsakes.');
  };

  const deleteQuoteFromBook = (bookId, quoteId) => {
    setBooks(prev =>
      prev.map(book => {
        if (book.id !== bookId) return book;
        return {
          ...book,
          quotes: (book.quotes || []).filter(q => q.id !== quoteId)
        };
      })
    );
    showToast('Quote removed.');
  };

  // --- JOURNAL CRUD ---
  const addJournalEntry = (entryData) => {
    const id = 'journal-' + Date.now();
    let bookTitle = '';
    if (entryData.bookId) {
      const b = books.find(item => item.id === entryData.bookId);
      if (b) bookTitle = b.title;
    }

    const newEntry = {
      id,
      title: entryData.title || 'Untitled Journal Note',
      date: entryData.date || getTodayDateString(),
      bookId: entryData.bookId || null,
      bookTitle,
      mood: entryData.mood || 'Reflective',
      content: entryData.content || '',
      tags: entryData.tags || []
    };

    setJournal(prev => [newEntry, ...prev]);
    showToast('Journal entry etched into your diary.');
    return newEntry;
  };

  const updateJournalEntry = (id, updatedFields) => {
    setJournal(prev =>
      prev.map(entry => {
        if (entry.id !== id) return entry;
        let bookTitle = entry.bookTitle;
        if (updatedFields.bookId) {
          const b = books.find(item => item.id === updatedFields.bookId);
          if (b) bookTitle = b.title;
        }
        return { ...entry, ...updatedFields, bookTitle };
      })
    );
    showToast('Journal entry updated.');
  };

  const deleteJournalEntry = (id) => {
    setJournal(prev => prev.filter(entry => entry.id !== id));
    showToast('Journal entry deleted.');
  };

  // --- IMPORT / EXPORT / RESET ---
  const handleExport = () => {
    exportLibraryAsJSON({ books, journal, sessions, goal, profile });
    showToast('Library exported to JSON successfully.');
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const validated = validateImportedJSON(parsed);
        setBooks(validated.books);
        setJournal(validated.journal);
        setSessions(validated.sessions);
        setGoal(validated.goal);
        setProfile(validated.profile);
        showToast('Library successfully imported!');
      } catch (err) {
        showToast(err.message || 'Error parsing imported file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToSample = () => {
    clearAllLibraryStorage();
    setBooks(INITIAL_BOOKS);
    setJournal(INITIAL_JOURNAL_ENTRIES);
    setSessions(INITIAL_READING_SESSIONS);
    setGoal(INITIAL_ANNUAL_GOAL);
    setSelectedBook(null);
    showToast('Sample library restored.');
  };

  const handleClearAll = () => {
    clearAllLibraryStorage();
    setBooks([]);
    setJournal([]);
    setSessions([]);
    setSelectedBook(null);
    showToast('Library cleared. Ready for your personal books.');
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        journal,
        sessions,
        goal,
        profile,
        activeTab,
        setActiveTab,
        selectedBook,
        setSelectedBook,
        isAddBookModalOpen,
        setIsAddBookModalOpen,
        bookToEdit,
        setBookToEdit,
        isLogSessionModalOpen,
        setIsLogSessionModalOpen,
        sessionTargetBook,
        setSessionTargetBook,
        toasts,
        showToast,
        removeToast,
        addBook,
        updateBook,
        deleteBook,
        updateBookProgress,
        logReadingSession,
        addQuoteToBook,
        deleteQuoteFromBook,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        setReadingGoal: setGoal,
        handleExport,
        handleImport,
        handleResetToSample,
        handleClearAll
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return ctx;
}
