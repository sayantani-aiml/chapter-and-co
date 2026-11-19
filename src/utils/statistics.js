/**
 * Statistical calculations derived purely from user's stored data.
 */

export function calculateReadingStreak(sessions = []) {
  if (!sessions || sessions.length === 0) return 0;

  // Extract unique sorted date strings (YYYY-MM-DD)
  const dateSet = new Set(
    sessions
      .filter(s => s.date && (s.pagesRead > 0 || s.minutes > 0))
      .map(s => s.date.slice(0, 10))
  );

  if (dateSet.size === 0) return 0;

  const today = new Date();
  const formatYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatYMD(today);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatYMD(yesterday);

  // If neither today nor yesterday has a reading session, current streak is 0
  let checkDate = new Date();
  if (!dateSet.has(todayStr)) {
    if (!dateSet.has(yesterdayStr)) {
      return 0;
    }
    // Started yesterday
    checkDate = yesterday;
  }

  let streak = 0;
  while (true) {
    const currentStr = formatYMD(checkDate);
    if (dateSet.has(currentStr)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateTotalPagesRead(books = [], sessions = []) {
  // Sum current pages of in-progress books + full pages of completed books
  const bookPages = books.reduce((acc, book) => {
    if (book.status === 'completed') {
      return acc + (Number(book.totalPages) || 0);
    }
    return acc + (Number(book.currentPage) || 0);
  }, 0);

  return bookPages;
}

export function calculateTotalMinutes(sessions = []) {
  return sessions.reduce((acc, s) => acc + (Number(s.minutes) || 0), 0);
}

export function calculateAverageRating(books = []) {
  const ratedBooks = books.filter(b => b.rating && Number(b.rating) > 0);
  if (ratedBooks.length === 0) return 0;
  const sum = ratedBooks.reduce((acc, b) => acc + Number(b.rating), 0);
  return Number((sum / ratedBooks.length).toFixed(1));
}

export function calculateGenreDistribution(books = []) {
  const genreCount = {};
  books.forEach(b => {
    const g = b.genre?.trim() || 'Uncategorized';
    genreCount[g] = (genreCount[g] || 0) + 1;
  });

  const palette = [
    '#713D46', // Burgundy
    '#899581', // Sage
    '#B97861', // Terracotta
    '#59634F', // Olive
    '#C89D9B', // Dusty rose
    '#45372F', // Dark espresso
    '#D4C5B2', // Warm border
    '#A07F6D'  // Muted leather
  ];

  return Object.keys(genreCount).map((genre, idx) => ({
    name: genre,
    value: genreCount[genre],
    color: palette[idx % palette.length]
  }));
}

export function calculateRatingDistribution(books = []) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  books.forEach(b => {
    if (b.rating && b.rating > 0) {
      const rounded = Math.round(b.rating);
      if (counts[rounded] !== undefined) {
        counts[rounded] += 1;
      }
    }
  });

  return [
    { stars: '5 Stars', count: counts[5] },
    { stars: '4 Stars', count: counts[4] },
    { stars: '3 Stars', count: counts[3] },
    { stars: '2 Stars', count: counts[2] },
    { stars: '1 Star', count: counts[1] }
  ];
}

export function calculateMonthlyCompletedBooks(books = []) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const monthlyData = monthNames.map(name => ({ month: name, count: 0 }));

  books.forEach(book => {
    if (book.status === 'completed' && book.dateFinished) {
      const d = new Date(book.dateFinished);
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        const monthIndex = d.getMonth();
        monthlyData[monthIndex].count += 1;
      }
    }
  });

  return monthlyData;
}

export function calculateHeatmapActivity(sessions = [], weeks = 14) {
  // Generate days for the last N weeks
  const totalDays = weeks * 7;
  const days = [];
  const sessionMap = {};

  sessions.forEach(s => {
    if (s.date) {
      const ymd = s.date.slice(0, 10);
      sessionMap[ymd] = (sessionMap[ymd] || 0) + (Number(s.pagesRead) || 1);
    }
  });

  const today = new Date();
  // Adjust to start on a Monday or Sunday for aligned weeks
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const pages = sessionMap[ymd] || 0;
    days.push({
      date: ymd,
      dayOfWeek: d.getDay(),
      pages,
      level: pages === 0 ? 0 : pages < 20 ? 1 : pages < 40 ? 2 : 3
    });
  }

  return days;
}

export function calculatePace(completedCount, goalTarget) {
  const currentDayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  const totalDaysInYear = 365;
  const expectedPace = (goalTarget / totalDaysInYear) * currentDayOfYear;
  const difference = completedCount - expectedPace;

  if (completedCount >= goalTarget) {
    return {
      status: 'Goal Accomplished!',
      message: 'You have surpassed your reading goal for this year. Every further page is pure joy.',
      badge: 'Completed',
      onTrack: true
    };
  }

  if (difference >= 0) {
    return {
      status: 'On Track',
      message: `You are roughly ${Math.ceil(difference) === 0 ? 'right on' : Math.ceil(difference) + ' books ahead of'} your target pace. Wonderful consistency!`,
      badge: 'Ahead of Pace',
      onTrack: true
    };
  } else {
    return {
      status: 'A gentle journey',
      message: `Take your time—reading is a sanctuary, not a sprint. Just ${Math.abs(Math.round(difference))} more book${Math.abs(Math.round(difference)) === 1 ? '' : 's'} to catch your target pace.`,
      badge: 'Steady Pace',
      onTrack: false
    };
  }
}
