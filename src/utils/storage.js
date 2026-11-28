import {
  INITIAL_BOOKS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_READING_SESSIONS,
  INITIAL_ANNUAL_GOAL,
  DEFAULT_PROFILE
} from '../data/sampleData';

const STORAGE_KEYS = {
  BOOKS: 'chapter_co_books',
  JOURNAL: 'chapter_co_journal',
  SESSIONS: 'chapter_co_sessions',
  GOAL: 'chapter_co_goal',
  USER_PROFILE: 'chapter_co_profile',
  THEME: 'chapter_co_theme',
  SHELVES: 'chapter_co_shelves'
};

export const INITIAL_SHELVES = [
  'All-Time Favorites',
  'Rainy Day Reads',
  'Cozy Autumn'
];

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
  const rawBooks = loadStoredData(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
  const books = Array.isArray(rawBooks)
    ? rawBooks.map((b) => ({
        ...b,
        shelves: Array.isArray(b.shelves) ? b.shelves : [],
        series: b.series && typeof b.series === 'object' ? b.series : null,
        rereads: Array.isArray(b.rereads) ? b.rereads : []
      }))
    : INITIAL_BOOKS;

  const journal = loadStoredData(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL_ENTRIES);
  const sessions = loadStoredData(STORAGE_KEYS.SESSIONS, INITIAL_READING_SESSIONS);
  const goal = loadStoredData(STORAGE_KEYS.GOAL, INITIAL_ANNUAL_GOAL);
  
  const rawShelves = loadStoredData(STORAGE_KEYS.SHELVES, INITIAL_SHELVES);
  const shelves = Array.isArray(rawShelves) ? rawShelves : INITIAL_SHELVES;

  const storedProfile = loadStoredData(STORAGE_KEYS.USER_PROFILE, DEFAULT_PROFILE);
  const profile = {
    ...DEFAULT_PROFILE,
    ...storedProfile,
    readingPersonality: {
      ...DEFAULT_PROFILE.readingPersonality,
      ...(storedProfile?.readingPersonality || {})
    },
    favourites: Array.isArray(storedProfile?.favourites) && storedProfile.favourites.length > 0
      ? storedProfile.favourites
      : DEFAULT_PROFILE.favourites
  };

  return { books, journal, sessions, goal, profile, shelves };
}

export function exportLibraryAsJSON(state) {
  const payload = {
    version: '1.1.0',
    exportDate: new Date().toISOString(),
    appName: 'Chapter & Co.',
    data: {
      books: state.books,
      journal: state.journal,
      sessions: state.sessions,
      goal: state.goal,
      profile: state.profile,
      shelves: state.shelves || INITIAL_SHELVES
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
  const books = data.books.map((b, idx) => {
    if (!b.title || !b.author) {
      throw new Error(`Book at position ${idx + 1} is missing a title or author.`);
    }
    return {
      ...b,
      shelves: Array.isArray(b.shelves) ? b.shelves : [],
      series: b.series && typeof b.series === 'object' ? b.series : null,
      rereads: Array.isArray(b.rereads) ? b.rereads : []
    };
  });

  return {
    books,
    journal: Array.isArray(data.journal) ? data.journal : [],
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    goal: typeof data.goal === 'number' ? data.goal : INITIAL_ANNUAL_GOAL,
    shelves: Array.isArray(data.shelves) ? data.shelves : INITIAL_SHELVES,
    profile: {
      ...DEFAULT_PROFILE,
      ...(data.profile || {}),
      readingPersonality: {
        ...DEFAULT_PROFILE.readingPersonality,
        ...(data.profile?.readingPersonality || {})
      },
      favourites: Array.isArray(data.profile?.favourites) && data.profile.favourites.length > 0
        ? data.profile.favourites
        : DEFAULT_PROFILE.favourites
    }
  };
}

export function clearAllLibraryStorage() {
  localStorage.removeItem(STORAGE_KEYS.BOOKS);
  localStorage.removeItem(STORAGE_KEYS.JOURNAL);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.GOAL);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.SHELVES);
}

export { STORAGE_KEYS };
