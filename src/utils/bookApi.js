/**
 * Open Library Search API integration for Chapter & Co.
 * Queries Open Library's public search endpoint and normalizes book metadata.
 */

/**
 * Maps subject strings returned by Open Library to the closest matching
 * genre preset defined in the Chapter & Co. collection.
 * Scans the first 10-15 entries of doc.subject, prioritizing specific genres
 * (Mystery, Thriller, Fantasy, Sci-Fi, Romance, Historical Fiction) over broad tags
 * before falling back to a default.
 * 
 * @param {string[]|string} subjects - Array or string of subjects from Open Library
 * @param {string} [defaultGenre='Literary Fiction'] - Fallback genre preset if no specific rule matches
 * @returns {string} Closest matching genre option from presets
 */
export function mapSubjectToGenre(subjects = [], defaultGenre = 'Literary Fiction') {
  if (!subjects) {
    return defaultGenre;
  }

  const subjectArray = Array.isArray(subjects) ? subjects : [subjects];
  if (subjectArray.length === 0) {
    return defaultGenre;
  }

  // Scan the first 10-15 entries of doc.subject, normalized to lowercase
  const scannedSubjects = subjectArray
    .slice(0, 15)
    .map((s) => String(s).toLowerCase().trim())
    .filter(Boolean);

  if (scannedSubjects.length === 0) {
    return defaultGenre;
  }

  // Priority mapping rules: specific genres are matched first before broad tags
  const genreRules = [
    {
      genre: 'Mystery',
      matches: [
        'mystery',
        'thriller',
        'detective',
        'crime',
        'murder',
        'suspense',
        'investigation',
        'espionage',
        'sleuth',
        'whodunit',
        'legal thriller',
        'psychological thriller'
      ]
    },
    {
      genre: 'Fantasy',
      matches: [
        'fantasy',
        'high fantasy',
        'epic fantasy',
        'urban fantasy',
        'dark fantasy',
        'magic',
        'wizards',
        'witches',
        'dragons',
        'sorcery',
        'mythology',
        'sword and sorcery'
      ]
    },
    {
      genre: 'Science Fiction',
      matches: [
        'science fiction',
        'sci-fi',
        'space opera',
        'cyberpunk',
        'dystopia',
        'dystopian',
        'time travel',
        'alien',
        'extraterrestrial',
        'futuristic',
        'post-apocalyptic',
        'steampunk',
        'artificial intelligence',
        'hard science fiction'
      ]
    },
    {
      genre: 'Gothic Fiction',
      matches: [
        'gothic',
        'horror',
        'ghost stories',
        'haunted',
        'vampire',
        'supernatural',
        'paranormal',
        'dark romanticism',
        'macabre',
        'monsters'
      ]
    },
    {
      genre: 'Classic Romance',
      matches: [
        'romance',
        'love stories',
        'courtship',
        'romantic',
        'regency romance',
        'romantic fiction',
        'historical romance',
        'contemporary romance'
      ]
    },
    {
      genre: 'Historical Fiction',
      matches: [
        'historical fiction',
        'historical novel',
        'regency',
        'victorian',
        'middle ages',
        'renaissance',
        'civil war',
        'world war',
        'ancient rome',
        'tudor'
      ]
    },
    {
      genre: 'Coming-of-Age',
      matches: [
        'coming of age',
        'bildungsroman',
        'youth',
        'adolescence',
        'growing up',
        'young adult',
        'ya fiction'
      ]
    },
    {
      genre: 'Children’s Classic',
      matches: [
        "children's",
        'childrens',
        'juvenile fiction',
        'juvenile literature',
        'fairy tale',
        'fairy tales',
        'fables',
        'picture book',
        'middle grade',
        'children stories'
      ]
    },
    {
      genre: 'Philosophical Fiction',
      matches: [
        'philosophical fiction',
        'philosophy',
        'philosophical',
        'existentialism',
        'existentialist',
        'morality',
        'metaphysics',
        'ethics'
      ]
    },
    {
      genre: 'Memoir',
      matches: [
        'memoir',
        'autobiography',
        'biographies',
        'biography',
        'diaries',
        'personal narratives',
        'letters',
        'correspondence'
      ]
    },
    {
      genre: 'Poetry',
      matches: [
        'poetry',
        'poems',
        'verse',
        'ballads',
        'sonnets',
        'poets'
      ]
    },
    {
      genre: 'Non-Fiction',
      matches: [
        'non-fiction',
        'nonfiction',
        'essays',
        'science',
        'psychology',
        'sociology',
        'history',
        'anthropology',
        'true crime',
        'journalism'
      ]
    },
    {
      genre: 'Literary Fiction',
      matches: [
        'literary fiction',
        'classic literature',
        'classics',
        'literature',
        'fiction',
        'general fiction',
        'novels',
        'novel',
        'short stories',
        'drama'
      ]
    }
  ];

  // Specific genre rules are tested in priority order across all scanned subjects
  for (const rule of genreRules) {
    for (const sub of scannedSubjects) {
      if (rule.matches.some((keyword) => sub.includes(keyword))) {
        return rule.genre;
      }
    }
  }

  return defaultGenre;
}

/**
 * Searches the Open Library Search API for books matching a title, author, or ISBN.
 * 
 * @param {string} query - Search term (title, author, or ISBN)
 * @returns {Promise<Array<{ id: string, title: string, author: string, totalPages: number|string, coverUrl: string, genre: string, publishYear: number|string }>>}
 */
export async function searchOpenLibrary(query) {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}&limit=6&fields=key,title,author_name,number_of_pages_median,cover_i,subject,first_publish_year`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open Library search failed with HTTP status ${response.status}`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.docs)) {
    return [];
  }

  return data.docs.map((doc, index) => {
    // Author formatting: use first author or joined authors if short
    let author = '';
    if (Array.isArray(doc.author_name) && doc.author_name.length > 0) {
      author = doc.author_name.slice(0, 2).join(', ');
    } else if (typeof doc.author_name === 'string') {
      author = doc.author_name;
    }

    // Cover image URL mapping with Open Library covers API
    const coverUrl = doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : '';

    // Closest genre preset
    const genre = mapSubjectToGenre(doc.subject);

    return {
      id: doc.key || `ol-result-${index}-${doc.cover_i || Math.random()}`,
      title: doc.title || '',
      author,
      totalPages: doc.number_of_pages_median || '',
      coverUrl,
      genre,
      publishYear: doc.first_publish_year || '',
      subjects: Array.isArray(doc.subject) ? doc.subject.slice(0, 15) : []
    };
  });
}

/**
 * Normalizes and cleans an Open Library or Google Books description string.
 * Strips trailing markdown reference links like `[1]: http...`.
 *
 * @param {string|{ value?: string }} raw
 * @returns {string}
 */
function cleanDescription(raw) {
  if (!raw) return '';
  const text = typeof raw === 'string'
    ? raw
    : (typeof raw.value === 'string' ? raw.value : '');
  if (!text) return '';

  return text
    .replace(/(?:\r?\n)+\s*\[\d+\]:\s*https?:\/\/\S+[\s\S]*$/i, '')
    .replace(/^\s*\[\d+\]:\s*https?:\/\/\S+$/gm, '')
    .trim();
}

/**
 * Extracts series name and number from a title or subtitle string.
 * Supports patterns like `(Series Name, #2)`, `(Series Name, Book 2)`,
 * `Series Name, Book 2`, `Volume 2`, `Part 2`, or `#2`.
 *
 * @param {string} text
 * @returns {{ seriesName: string, seriesNumber: string }}
 */
function extractSeriesFromText(text) {
  if (!text || typeof text !== 'string') {
    return { seriesName: '', seriesNumber: '' };
  }

  const trimmed = text.trim();

  // Parenthetical pattern: "(Series Name, #2)" or "(Series Name, Book 2)"
  const parenMatch = trimmed.match(/\(([^()]+?)[,\s]+(?:#|Book|Vol\.?|Volume|Part)\s*(\d+)\s*\)/i);
  if (parenMatch) {
    return {
      seriesName: parenMatch[1].trim().replace(/[,:\-–—]+$/, '').trim(),
      seriesNumber: parenMatch[2]
    };
  }

  // Named series with number: "Series Name, Book 2" / "Series Name: Volume 2" / "Series Name #2"
  const namedMatch = trimmed.match(/^(.+?)[,:\-–—\s]+(?:#|Book|Vol\.?|Volume|Part)\s*(\d+)\b/i);
  if (namedMatch) {
    const candidateName = namedMatch[1].trim().replace(/[,:\-–—]+$/, '').trim();
    if (candidateName && !/^(?:a|an|the)?\s*novel$/i.test(candidateName)) {
      return {
        seriesName: candidateName,
        seriesNumber: namedMatch[2]
      };
    }
  }

  // Number-only pattern in subtitle: "Book 2", "#2", "Volume 2", "Part 2"
  const numberOnlyMatch = trimmed.match(/^(?:#|Book|Vol\.?|Volume|Part)\s*(\d+)\b/i);
  if (numberOnlyMatch) {
    return {
      seriesName: '',
      seriesNumber: numberOnlyMatch[1]
    };
  }

  return { seriesName: '', seriesNumber: '' };
}

const ORDINAL_TO_NUMBER = {
  first: '1',
  second: '2',
  third: '3',
  fourth: '4',
  fifth: '5',
  sixth: '6',
  seventh: '7',
  eighth: '8',
  ninth: '9',
  tenth: '10'
};

/**
 * Extracts series clues from the first two sentences of a book description,
 * supporting patterns like `Book 2 in the [Series]`, `second book in the [Series] series`,
 * `[Series], Book 2`, `[Series] #2`, and `sequel to [Title]`.
 *
 * @param {string} description
 * @returns {{ seriesName: string, seriesNumber: string }}
 */
function extractSeriesFromDescription(description) {
  if (!description || typeof description !== 'string') {
    return { seriesName: '', seriesNumber: '' };
  }

  const firstTwoSentences = description
    .trim()
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(' ');

  if (!firstTwoSentences) {
    return { seriesName: '', seriesNumber: '' };
  }

  // Pattern: "Book 2 in the [Series] series" / "Volume 2 of [Series]"
  const bookInSeriesMatch = firstTwoSentences.match(
    /\b(?:Book|Vol\.?|Volume|Part)\s*(\d+)\s+(?:in|of)\s+(?:the\s+)?["“']?([^.!?,;:"”'\n()]{2,65}?)["”']?(?:\s+(?:series|trilogy|quartet|saga|cycle)|[.,;!?]|$)/i
  );
  if (bookInSeriesMatch) {
    return {
      seriesName: bookInSeriesMatch[2].trim(),
      seriesNumber: bookInSeriesMatch[1]
    };
  }

  // Pattern: "the second book in the [Series] series" / "2nd installment of [Series]"
  const ordinalMatch = firstTwoSentences.match(
    /\b(?:the\s+)?(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(?:st|nd|rd|th))\s+(?:book|novel|installment|volume|part)\s+(?:in|of)\s+(?:the\s+)?["“']?([^.!?,;:"”'\n()]{2,65}?)["”']?(?:\s+(?:series|trilogy|quartet|saga|cycle)|[.,;!?]|$)/i
  );
  if (ordinalMatch) {
    const rawOrd = ordinalMatch[1].toLowerCase();
    const num = ORDINAL_TO_NUMBER[rawOrd] || rawOrd.replace(/(?:st|nd|rd|th)$/i, '');
    return {
      seriesName: ordinalMatch[2].trim(),
      seriesNumber: num
    };
  }

  // Pattern: "sequel to [Title]" -> seriesName = Title, seriesNumber = '2'
  const sequelMatch = firstTwoSentences.match(
    /\bsequel\s+to\s+(?:the\s+(?:bestselling|acclaimed|hit|award-winning|smash)\s+)?["“']?([A-Z][^.!?,;:"”'\n()]{2,60}?)["”']?(?:\s+(?:by\s+|[.,;!?]|$))/i
  );
  if (sequelMatch) {
    return {
      seriesName: sequelMatch[1].trim(),
      seriesNumber: '2'
    };
  }

  // Fallback to parenthetical or inline "[Series], Book 2" / "[Series] #2"
  const inlineMatch = firstTwoSentences.match(
    /["“']?([A-Z][^.!?,;:"”'\n()]{2,55}?)["”']?[,\s]+(?:#|Book|Vol\.?|Volume|Part)\s*(\d+)\b/
  );
  if (inlineMatch) {
    return {
      seriesName: inlineMatch[1].trim(),
      seriesNumber: inlineMatch[2]
    };
  }

  return { seriesName: '', seriesNumber: '' };
}

/**
 * Extracts series clues from Open Library subject tags, e.g.
 * `series:A_Good_Girl's_Guide_to_Murder` or `... series`.
 *
 * @param {string[]} subjects
 * @returns {{ seriesName: string, seriesNumber: string }}
 */
function extractSeriesFromSubjects(subjects) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return { seriesName: '', seriesNumber: '' };
  }

  for (const rawSubject of subjects) {
    if (typeof rawSubject !== 'string') continue;
    const sub = rawSubject.trim();
    if (!sub) continue;

    // Pattern: series:A_Good_Girl's_Guide_to_Murder
    if (/^series:/i.test(sub)) {
      const cleaned = sub
        .replace(/^series:/i, '')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned) {
        const parsed = extractSeriesFromText(cleaned);
        if (parsed.seriesName) {
          return parsed;
        }
        return { seriesName: cleaned, seriesNumber: '' };
      }
    }

    // Pattern: "<Series Name> series"
    const suffixMatch = sub.match(/^(.+?)\s+series$/i);
    if (suffixMatch) {
      const candidate = suffixMatch[1].trim();
      if (
        candidate &&
        !/^(?:television|tv|radio|film|animated|comic|book|novel|fiction)$/i.test(candidate)
      ) {
        return { seriesName: candidate, seriesNumber: '' };
      }
    }
  }

  return { seriesName: '', seriesNumber: '' };
}

/**
 * Fetches extended book details (synopsis and series metadata) for a selected
 * Open Library search result, with Google Books API fallback.
 *
 * @param {{ id?: string, title?: string, author?: string, subjects?: string[] }} book
 * @returns {Promise<{ description: string, seriesName: string, seriesNumber: string }>}
 */
export async function fetchBookDetails(book) {
  let description = '';
  let seriesName = '';
  let seriesNumber = '';

  if (!book || typeof book !== 'object') {
    return { description, seriesName, seriesNumber };
  }

  // Step A — Open Library Work Details & Editions
  let workSubjects = Array.isArray(book.subjects) ? [...book.subjects] : [];

  if (typeof book.id === 'string' && book.id.startsWith('/')) {
    const [workResult, editionsResult] = await Promise.allSettled([
      fetch(`https://openlibrary.org${book.id}.json`),
      fetch(`https://openlibrary.org${book.id}/editions.json?limit=5`)
    ]);

    if (workResult.status === 'fulfilled' && workResult.value.ok) {
      try {
        const workData = await workResult.value.json();
        if (workData) {
          description = cleanDescription(workData.description);

          if (Array.isArray(workData.subjects)) {
            workSubjects = [...workData.subjects, ...workSubjects];
          }

          const titleClues = [workData.subtitle, workData.title, book.title];
          for (const clue of titleClues) {
            const parsed = extractSeriesFromText(clue);
            if (!seriesName && parsed.seriesName) seriesName = parsed.seriesName;
            if (!seriesNumber && parsed.seriesNumber) seriesNumber = parsed.seriesNumber;
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    if (editionsResult.status === 'fulfilled' && editionsResult.value.ok) {
      try {
        const editionsData = await editionsResult.value.json();
        const entries = Array.isArray(editionsData?.entries) ? editionsData.entries : [];

        for (const entry of entries) {
          if (seriesName && seriesNumber) break;
          const entrySeriesList = Array.isArray(entry?.series) ? entry.series : [];
          for (const rawSeries of entrySeriesList) {
            if (typeof rawSeries !== 'string' || !rawSeries.trim()) continue;
            const parsed = extractSeriesFromText(rawSeries);
            if (parsed.seriesName || parsed.seriesNumber) {
              if (!seriesName && parsed.seriesName) seriesName = parsed.seriesName;
              if (!seriesNumber && parsed.seriesNumber) seriesNumber = parsed.seriesNumber;
            } else {
              // Handle "Series Name, 2" or bare "Series Name" in edition.series
              const commaNumMatch = rawSeries.trim().match(/^(.+?),\s*(\d+)$/);
              if (commaNumMatch) {
                if (!seriesName) seriesName = commaNumMatch[1].trim();
                if (!seriesNumber) seriesNumber = commaNumMatch[2];
              } else if (!seriesName) {
                seriesName = rawSeries.trim();
              }
            }
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  if (!seriesName || !seriesNumber) {
    const subjectSeries = extractSeriesFromSubjects(workSubjects);
    if (!seriesName && subjectSeries.seriesName) seriesName = subjectSeries.seriesName;
    if (!seriesNumber && subjectSeries.seriesNumber) seriesNumber = subjectSeries.seriesNumber;
  }

  if (!seriesName || !seriesNumber) {
    const titleParsed = extractSeriesFromText(book.title);
    if (!seriesName && titleParsed.seriesName) seriesName = titleParsed.seriesName;
    if (!seriesNumber && titleParsed.seriesNumber) seriesNumber = titleParsed.seriesNumber;
  }

  // Step B — Google Books Fallback (No API Key, scan up to 5 results)
  if ((!description || !seriesName || !seriesNumber) && book.title) {
    try {
      const queryParts = [`intitle:${encodeURIComponent(book.title)}`];
      if (book.author) {
        queryParts.push(`inauthor:${encodeURIComponent(book.author)}`);
      }
      const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${queryParts.join('+')}&maxResults=5`;
      const gbRes = await fetch(gbUrl);

      if (gbRes.ok) {
        const gbData = await gbRes.json();
        const items = Array.isArray(gbData?.items) ? gbData.items : [];
        let bestDescription = '';

        for (const item of items) {
          const volumeInfo = item?.volumeInfo;
          if (!volumeInfo) continue;

          if (!description && volumeInfo.description) {
            const candidateDesc = cleanDescription(volumeInfo.description);
            if (candidateDesc.length > bestDescription.length) {
              bestDescription = candidateDesc;
            }
          }

          if (!seriesName || !seriesNumber) {
            const seriesInfo = volumeInfo.seriesInfo || item.seriesInfo;
            if (seriesInfo) {
              const orderNum =
                seriesInfo.bookDisplayNumber ||
                seriesInfo.volumeSeries?.[0]?.orderNumber;
              if (!seriesNumber && orderNum !== undefined && orderNum !== null && orderNum !== '') {
                seriesNumber = String(orderNum);
              }
            }

            const gbClues = [volumeInfo.subtitle, volumeInfo.title];
            for (const clue of gbClues) {
              const parsed = extractSeriesFromText(clue);
              if (!seriesName && parsed.seriesName) seriesName = parsed.seriesName;
              if (!seriesNumber && parsed.seriesNumber) seriesNumber = parsed.seriesNumber;
            }

            if ((!seriesName || !seriesNumber) && volumeInfo.description) {
              const descParsed = extractSeriesFromDescription(volumeInfo.description);
              if (!seriesName && descParsed.seriesName) seriesName = descParsed.seriesName;
              if (!seriesNumber && descParsed.seriesNumber) seriesNumber = descParsed.seriesNumber;
            }
          }
        }

        if (!description && bestDescription) {
          description = bestDescription;
        }
      }
    } catch {
      // Silently ignore Google Books fallback errors
    }
  }

  return {
    description,
    seriesName,
    seriesNumber: seriesNumber !== '' && seriesNumber !== null && seriesNumber !== undefined
      ? String(seriesNumber)
      : ''
  };
}
