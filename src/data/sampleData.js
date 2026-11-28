import { daysAgo } from '../utils/dates';

export const INITIAL_ANNUAL_GOAL = 24;

export const INITIAL_BOOKS = [
  {
    id: 'book-1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Classic Romance',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
    description: 'A romantic clash between the opinionated Elizabeth Bennet and her proud beau, Mr. Fitzwilliam Darcy, exploring manners, upbringing, morality, education, and marriage in Regency England.',
    totalPages: 432,
    currentPage: 432,
    status: 'completed',
    rating: 5,
    dateStarted: daysAgo(52),
    dateFinished: daysAgo(38),
    review: 'An absolute masterpiece of wit, sharp social dialogue, and character development. Elizabeth Bennet remains one of the most delightful protagonists in English literature.',
    tags: ['Regency', 'Favorites', 'Comfort Read', 'Austen'],
    quotes: [
      {
        id: 'q-101',
        text: 'I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book!',
        page: 68,
        dateAdded: daysAgo(45),
        note: 'Miss Bingley feigning literary devotion, but the sentiment remains eternal.'
      },
      {
        id: 'q-102',
        text: 'There is a stubbornness about me that never can bear to be frightened at the will of others. My courage always rises at every attempt to intimidate me.',
        page: 175,
        dateAdded: daysAgo(40),
        note: 'Elizabeth standing her ground with such quiet strength.'
      }
    ]
  },
  {
    id: 'book-2',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: 'Gothic Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80',
    description: 'The journey of an orphaned governess who confronts harsh hardships, discovering passion, moral integrity, and deep dark secrets in the brooding Thornfield Hall.',
    totalPages: 532,
    currentPage: 348,
    status: 'currently-reading',
    rating: 5,
    dateStarted: daysAgo(16),
    dateFinished: '',
    review: 'Atmospheric, passionate, and fiercely independent. Reading this by candlelight during a rainy evening has been magical.',
    tags: ['Gothic', 'Victorian', 'Autumn Reads'],
    quotes: [
      {
        id: 'q-103',
        text: 'I am no bird; and no net ensnares me; I am a free human being with an independent will, which I now exert to leave you.',
        page: 268,
        dateAdded: daysAgo(6),
        note: 'One of the most powerful declarations of female agency ever written.'
      }
    ]
  },
  {
    id: 'book-3',
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    genre: 'Children’s Classic',
    coverUrl: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=700&q=80',
    description: 'Sent to live on the Yorkshire moors, sour Mary Lennox discovers a neglected walled garden, unlocking the healing magic of nature, friendship, and living things.',
    totalPages: 312,
    currentPage: 312,
    status: 'completed',
    rating: 4.5,
    dateStarted: daysAgo(75),
    dateFinished: daysAgo(61),
    review: 'A gentle, restorative tonic. The descriptions of the awakening moor and the budding roses made my heart ache with nostalgia.',
    tags: ['Cottagecore', 'Healing', 'Nature'],
    quotes: [
      {
        id: 'q-104',
        text: 'If you look the right way, you can see that the whole world is a garden.',
        page: 294,
        dateAdded: daysAgo(62),
        note: 'Such a tender reminder to change one\'s perspective.'
      }
    ]
  },
  {
    id: 'book-4',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    genre: 'Philosophical Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=700&q=80',
    description: 'A decadent tale of a hedonistic young aristocrat whose youthful portrait ages and reflects his inner corruption while he retains unblemished outward beauty.',
    totalPages: 254,
    currentPage: 254,
    status: 'completed',
    rating: 5,
    dateStarted: daysAgo(98),
    dateFinished: daysAgo(85),
    review: 'Every sentence is seasoned with Wilde\'s razor-sharp aestheticism and aphorisms. Sinister, brilliant, and deeply captivating.',
    tags: ['Aestheticism', 'Philosophy', 'Classics'],
    quotes: [
      {
        id: 'q-105',
        text: 'It is what you read when you don\'t have to that determines what you will be when you can\'t help it.',
        page: 84,
        dateAdded: daysAgo(90),
        note: 'A quote to frame above one\'s personal writing desk.'
      }
    ]
  },
  {
    id: 'book-5',
    title: 'Little Women',
    author: 'Louisa May Alcott',
    genre: 'Coming-of-Age',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
    description: 'The heartwarming and resilient lives of the four March sisters—Meg, Jo, Beth, and Amy—growing up in New England during the American Civil War.',
    totalPages: 449,
    currentPage: 165,
    status: 'currently-reading',
    rating: 4.5,
    dateStarted: daysAgo(8),
    dateFinished: '',
    review: 'Like being wrapped in a handmade woollen blanket with a cup of spiced tea.',
    tags: ['Comfort', 'Sisters', 'Writing Life'],
    quotes: [
      {
        id: 'q-106',
        text: 'I want to do something splendid, something heroic or wonderful that won\'t be forgotten after I\'m dead.',
        page: 112,
        dateAdded: daysAgo(4),
        note: 'Jo March voicing every ambitious young creator\'s yearning.'
      }
    ]
  },
  {
    id: 'book-6',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: 'Science Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=80',
    description: 'The chilling story of Victor Frankenstein and the monstrous creature born of forbidden science, tragic hubris, and abandonment.',
    totalPages: 280,
    currentPage: 280,
    status: 'completed',
    rating: 4.5,
    dateStarted: daysAgo(120),
    dateFinished: daysAgo(108),
    review: 'Much more poetic and philosophical than popular adaptations convey. Shelley wrote this at eighteen—truly mind-boggling genius.',
    tags: ['Sci-Fi Pioneer', 'Gothic', 'Dark Academia'],
    quotes: [
      {
        id: 'q-107',
        text: 'Beware; for I am fearless, and therefore powerful.',
        page: 167,
        dateAdded: daysAgo(110),
        note: 'The creature confronting his creator.'
      }
    ]
  },
  {
    id: 'book-7',
    title: 'Anne of Green Gables',
    author: 'L.M. Montgomery',
    genre: 'Literary Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80',
    description: 'An imaginative, talkative orphan girl is mistakenly sent to an aging brother and sister on Prince Edward Island, forever altering their quiet lives.',
    totalPages: 320,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    dateStarted: '',
    dateFinished: '',
    review: '',
    tags: ['Wholesome', 'Prince Edward Island', 'Spring TBR'],
    quotes: []
  },
  {
    id: 'book-8',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Historical Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80',
    description: 'In the Roaring Twenties on Long Island, narrator Nick Carraway is drawn into the lavish, mysterious world of Jay Gatsby and his obsession with Daisy Buchanan.',
    totalPages: 180,
    currentPage: 180,
    status: 'completed',
    rating: 5,
    dateStarted: daysAgo(140),
    dateFinished: daysAgo(132),
    review: 'Every paragraph sparkles like champagne. The final lines never fail to give me shivers.',
    tags: ['Jazz Age', 'Tragic', 'Modern Classics'],
    quotes: [
      {
        id: 'q-108',
        text: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
        page: 180,
        dateAdded: daysAgo(132),
        note: 'Perhaps the most sublime closing sentence in American prose.'
      }
    ]
  },
  {
    id: 'book-9',
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=700&q=80',
    description: 'A tempestuous tale of fierce passion, destructive obsession, and spectral revenge between Heathcliff and Catherine Earnshaw on the lonely Yorkshire moors.',
    totalPages: 416,
    currentPage: 120,
    status: 'on-hold',
    rating: 3.5,
    dateStarted: daysAgo(35),
    dateFinished: '',
    review: 'Intense and tempestuous. Paused temporarily for something lighter, will return when autumn rain sets in.',
    tags: ['Yorkshire', 'Gothic Drama'],
    quotes: [
      {
        id: 'q-109',
        text: 'Whatever our souls are made of, his and mine are the same.',
        page: 81,
        dateAdded: daysAgo(30),
        note: 'Passionate and untamed.'
      }
    ]
  },
  {
    id: 'book-10',
    title: 'To the Lighthouse',
    author: 'Virginia Woolf',
    genre: 'Modernist Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80',
    description: 'A stream-of-consciousness exploration of the Ramsay family and their visits to the Isle of Skye between 1910 and 1920, examining art, time, and human memory.',
    totalPages: 209,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    dateStarted: '',
    dateFinished: '',
    review: '',
    tags: ['Bloomsbury', 'Stream of Consciousness', 'Woolf'],
    quotes: []
  }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'journal-1',
    title: 'Rain against the windowpane & Jane Eyre',
    date: daysAgo(2),
    bookId: 'book-2',
    bookTitle: 'Jane Eyre',
    mood: 'Cozy',
    content: 'Spent three uninterrupted hours in the armchair with a hot pot of Earl Grey tea. The rain came down steadily against the bay window, matching the brooding, mist-shrouded moors of Thornfield Hall. Charlotte Brontë\'s mastery of quiet atmospheric tension is unmatched. I found myself holding my breath during Jane\'s nocturnal encounter in the hallway.',
    tags: ['Rainy Day', 'Tea Time', 'Atmosphere']
  },
  {
    id: 'journal-2',
    title: 'Reflections on Elizabeth Bennet’s quick mind',
    date: daysAgo(39),
    bookId: 'book-1',
    bookTitle: 'Pride and Prejudice',
    mood: 'Reflective',
    content: 'Just closed the final pages of Pride and Prejudice for the third time in my life. What always strikes me anew is how modern Elizabeth feels in her refusal to compromise her dignity for social security or comfort. Her confrontation with Lady Catherine de Bourgh is literary gold. A rare book that leaves the reader lighter and more hopeful about human connection.',
    tags: ['Jane Austen', 'Re-read', 'Classics']
  },
  {
    id: 'journal-3',
    title: 'A morning browse at the second-hand antiquarian',
    date: daysAgo(14),
    bookId: null,
    bookTitle: '',
    mood: 'Inspired',
    content: 'Found a lovely 1928 illustrated edition of The Secret Garden tucked into the lowest shelf of the corner bookshop today. The paper has that warm vanilla and cedar aroma that only real age gives. Reminded me why physical books hold a quiet sanctuary nothing digital can ever replace.',
    tags: ['Bookshops', 'Bibliophile', 'Quiet Moments']
  },
  {
    id: 'journal-4',
    title: 'The melancholy beauty of Dorian Gray’s downfall',
    date: daysAgo(86),
    bookId: 'book-4',
    bookTitle: 'The Picture of Dorian Gray',
    mood: 'Melancholic',
    content: 'Wilde understood human vanity better than almost anyone. The ending hits like an iron bell. It made me reflect on what we trade when we choose spectacle over substance. Still thinking about Lord Henry\'s poisoned dinner speeches.',
    tags: ['Oscar Wilde', 'Late Night Reading']
  }
];

// Reading activity sessions used to calculate streaks, minutes, and calendar activity
export const INITIAL_READING_SESSIONS = [
  { id: 's-1', date: daysAgo(0), bookId: 'book-2', bookTitle: 'Jane Eyre', pagesRead: 32, minutes: 45 },
  { id: 's-2', date: daysAgo(1), bookId: 'book-2', bookTitle: 'Jane Eyre', pagesRead: 28, minutes: 40 },
  { id: 's-3', date: daysAgo(2), bookId: 'book-2', bookTitle: 'Jane Eyre', pagesRead: 45, minutes: 60 },
  { id: 's-4', date: daysAgo(3), bookId: 'book-5', bookTitle: 'Little Women', pagesRead: 25, minutes: 35 },
  { id: 's-5', date: daysAgo(4), bookId: 'book-5', bookTitle: 'Little Women', pagesRead: 30, minutes: 40 },
  { id: 's-6', date: daysAgo(5), bookId: 'book-2', bookTitle: 'Jane Eyre', pagesRead: 40, minutes: 50 },
  { id: 's-7', date: daysAgo(6), bookId: 'book-2', bookTitle: 'Jane Eyre', pagesRead: 22, minutes: 30 },
  { id: 's-8', date: daysAgo(7), bookId: 'book-5', bookTitle: 'Little Women', pagesRead: 35, minutes: 50 },
  { id: 's-9', date: daysAgo(9), bookId: 'book-5', bookTitle: 'Little Women', pagesRead: 20, minutes: 25 },
  { id: 's-10', date: daysAgo(11), bookId: 'book-2', bookTitle: 'Jane Eyre', pagesRead: 50, minutes: 70 },
  { id: 's-11', date: daysAgo(14), bookId: 'book-9', bookTitle: 'Wuthering Heights', pagesRead: 35, minutes: 45 },
  { id: 's-12', date: daysAgo(16), bookId: 'book-9', bookTitle: 'Wuthering Heights', pagesRead: 28, minutes: 35 },
  { id: 's-13', date: daysAgo(22), bookId: 'book-9', bookTitle: 'Wuthering Heights', pagesRead: 42, minutes: 55 },
  { id: 's-14', date: daysAgo(38), bookId: 'book-1', bookTitle: 'Pride and Prejudice', pagesRead: 60, minutes: 75 },
  { id: 's-15', date: daysAgo(40), bookId: 'book-1', bookTitle: 'Pride and Prejudice', pagesRead: 45, minutes: 60 }
];

export const LITERARY_QUOTES_INSPIRATION = [
  {
    quote: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin"
  },
  {
    quote: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway"
  },
  {
    quote: "Books are a uniquely portable magic.",
    author: "Stephen King"
  },
  {
    quote: "You can never get a cup of tea large enough or a book long enough to suit me.",
    author: "C.S. Lewis"
  },
  {
    quote: "I have always imagined that Paradise will be a kind of library.",
    author: "Jorge Luis Borges"
  },
  {
    quote: "She reads books as one would breathe air, to fill up and live.",
    author: "Annie Dillard"
  }
];

export const GENRE_OPTIONS = [
  'All Genres',
  'Classic Romance',
  'Gothic Fiction',
  'Philosophical Fiction',
  'Coming-of-Age',
  'Science Fiction',
  'Literary Fiction',
  'Children’s Classic',
  'Historical Fiction',
  'Mystery',
  'Fantasy',
  'Memoir',
  'Poetry',
  'Non-Fiction'
];

export const MOOD_OPTIONS = [
  { label: 'Cozy', color: 'var(--color-terracotta)', bg: 'var(--color-terracotta-light)' },
  { label: 'Reflective', color: 'var(--color-olive)', bg: 'var(--color-sage-light)' },
  { label: 'Inspired', color: '#B07530', bg: '#FDF6E9' },
  { label: 'Melancholic', color: 'var(--color-burgundy)', bg: 'var(--color-burgundy-light)' },
  { label: 'Excited', color: '#8A5D3B', bg: '#F7EDE6' },
  { label: 'Heartbroken', color: '#7E6377', bg: '#F5EFF4' }
];

export const READER_TYPE_OPTIONS = [
  'The Atmospheric Escapist',
  'The Cozy Comfort Reader',
  'The Scholarly Annotator',
  'The Midnight Devourer',
  'The Whimsical Wanderer',
  'The Emotional Collector'
];

export const READING_TIME_OPTIONS = [
  'Late evenings by warm lamplight',
  'Early dawn with morning black coffee',
  'Rainy Sunday afternoons',
  'Quiet twilight hours in the garden',
  'Late-night silence in bed'
];

export const FORMAT_PREFERENCE_OPTIONS = [
  'Physical Books (Hardcovers & Deckle Edges)',
  'Physical Paperbacks (Pocket Editions)',
  'E-Reader / Ebooks (Paperwhite / Warm Light)',
  'Audiobooks (Immersive Narrations)',
  'Hybrid Reader (Any format that holds a story)'
];

export const DEFAULT_PROFILE = {
  name: 'Eleanor Vance',
  username: 'eleanor.reads',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  age: 26,
  dateOfBirth: '1998-04-12',
  gender: 'Female',
  location: 'Edinburgh, Scotland',
  tagline: 'Lost between the pages of 19th-century novels and cups of Earl Grey.',
  bio: "A lifelong bibliophile and collector of antique paperbacks. When I'm not wandering quiet second-hand bookshops or annotating margin notes, you can find me writing letters with fountain pens, tending to my indoor botanical jungle, or trying yet another blend of lavender tea.",
  occupation: 'Literary Archivist & Book Conservator',
  education: 'M.A. in English Literature, University of Edinburgh',
  favoriteBookstore: 'Shakespeare & Company',
  personalQuote: 'I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book!',
  personalQuoteAuthor: 'Jane Austen, Pride and Prejudice',
  readingPersonality: {
    readerType: 'The Atmospheric Escapist',
    favouriteGenre: 'Gothic Fiction & Victorian Romance',
    readingTime: 'Late evenings by warm lamplight',
    formatPreference: 'Physical Books (Hardcovers & Deckle Edges)',
    readingAtmosphere: 'A deep velvet armchair beside a rainy bay window, a crackling cedar fire, and an oversized mug of hot spiced chai.',
    personalityDescription: 'You read for sanctuary and slow living. You savor every sentence, frequently pause to admire beautiful turns of phrase, and keep dried flowers between your favorite chapters. For you, books are not numbers on a checklist, but lifelong companions.'
  },
  favourites: [
    { id: 'fav-1', category: 'Favourite Book', value: 'Pride and Prejudice', icon: 'BookOpen', note: 'Read 4 times; eternal comfort' },
    { id: 'fav-2', category: 'Favourite Author', value: 'Jane Austen', icon: 'Feather', note: 'Matchless wit and keen observations' },
    { id: 'fav-3', category: 'Favourite Genre', value: 'Gothic Classics & Victorian Drama', icon: 'Bookmark', note: 'Moody moors and brooding halls' },
    { id: 'fav-4', category: 'Favourite Character', value: 'Elizabeth Bennet', icon: 'UserCheck', note: 'Fierce independence and bright humor' },
    { id: 'fav-5', category: 'Favourite Book Series', value: 'Anne of Green Gables', icon: 'Layers', note: 'L.M. Montgomery’s idyllic island prose' },
    { id: 'fav-6', category: 'Favourite Movie', value: 'Little Women (2019)', icon: 'Film', note: 'Directed by Greta Gerwig' },
    { id: 'fav-7', category: 'Favourite TV Show / Anime', value: 'Anne with an E & Frieren', icon: 'Tv', note: 'Poetic, gentle, and contemplative' },
    { id: 'fav-8', category: 'Favourite Music Artist', value: 'Sleeping At Last', icon: 'Music', note: 'The ultimate reading soundtrack' },
    { id: 'fav-9', category: 'Favourite Song', value: 'Turning Page', icon: 'Disc', note: 'Sublime cello and piano chords' },
    { id: 'fav-10', category: 'Favourite Colour', value: 'Antique Sage Green', icon: 'Palette', color: '#899581', note: 'Muted tranquility of dried eucalyptus' },
    { id: 'fav-11', category: 'Favourite Food', value: 'Warm Cinnamon Scones with Clotted Cream', icon: 'Coffee', note: 'Best served with steaming Earl Grey' },
    { id: 'fav-12', category: 'Favourite Hobby', value: 'Fountain pen journaling & Antiquing', icon: 'Compass', note: 'Ink-stained fingers and old dust' },
    { id: 'fav-13', category: 'Favourite Fictional Universe', value: 'The Shire (Middle-earth)', icon: 'Globe', note: 'Round green doors, tea, and warm hearths' }
  ]
};
