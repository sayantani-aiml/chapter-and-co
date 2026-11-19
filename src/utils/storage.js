import {
  INITIAL_BOOKS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_READING_SESSIONS,
  INITIAL_ANNUAL_GOAL
} from '../data/sampleData';

const STORAGE_KEYS = {
  BOOKS: 'chapter_co_books',
  JOURNAL: 'chapter_co_journal',
  SESSIONS: 'chapter_co_sessions',
  GOAL: 'chapter_co_goal',
  USER_PROFILE: 'chapter_co_profile'
};

export function loadStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.error(`Failed to load key ${key} from localStorage:`, err);
    return fallback;
  }
}

export function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save key ${key} to localStorage:`, err);
  }
}

export function getInitialLibraryState() {
  const books = loadStoredData(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  const journal = loadStoredData(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL_ENTRIES);
  const sessions = loadStoredData(STORAGE_KEYS.SESSIONS, INITIAL_READING_SESSIONS);
  const goal = loadStoredData(STORAGE_KEYS.GOAL, INITIAL_ANNUAL_GOAL);
  const profile = loadStoredData(STORAGE_KEYS.USER_PROFILE, {
    name: 'Eleanor Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    favoriteBookstore: 'Shakespeare & Company'
  });

  return { books, journal, sessions, goal, profile };
}

export function exportLibraryAsJSON(state) {
  const payload = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    appName: 'Chapter & Co.',
    data: {
      books: state.books,
      journal: state.journal,
      sessions: state.sessions,
      goal: state.goal,
      profile: state.profile
    }
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(payload, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `chapter_and_co_library_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function validateImportedJSON(parsedJson) {
  if (!parsedJson || typeof parsedJson !== 'object') {
    throw new Error('Invalid JSON structure.');
  }

  const data = parsedJson.data || parsedJson;

  if (!Array.isArray(data.books)) {
    throw new Error('Import data must include a valid "books" array.');
  }

  // Validate books structure
  data.books.forEach((b, idx) => {
    if (!b.title || !b.author) {
      throw new Error(`Book at position ${idx + 1} is missing a title or author.`);
    }
  });

  return {
    books: data.books,
    journal: Array.isArray(data.journal) ? data.journal : [],
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    goal: typeof data.goal === 'number' ? data.goal : INITIAL_ANNUAL_GOAL,
    profile: data.profile || { name: 'Book Lover' }
  };
}

export function clearAllLibraryStorage() {
  localStorage.removeItem(STORAGE_KEYS.BOOKS);
  localStorage.removeItem(STORAGE_KEYS.JOURNAL);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.GOAL);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

export { STORAGE_KEYS };
