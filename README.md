# Chapter & Co.
### *A little home for the stories you keep.*

A personal reading tracker, digital bookshelf, and reading journal designed for bibliophiles, slow living enthusiasts, and lovers of cosy independent bookstores and warm vintage stationery.

---

## 📖 Overview

**Chapter & Co.** is a complete, fully functional, beautifully crafted web application designed to capture the quiet warmth of sitting in an antique bookshop with a hot cup of tea. It combines an editorial aesthetic with practical, persistent tools for tracking your library, logging daily reading sessions, reflecting in a literary journal, and keeping collectible quotes.

---

## ✨ Features

- **Cozy Literary Editorial Aesthetic**
  - Custom palette inspired by antique paper, warm parchment (`#F6F1E7`), deep burgundy (`#713D46`), muted sage (`#899581`), dusty rose (`#C89D9B`), and espresso typography (`#45372F`).
  - Google Fonts typography pairing: **Cormorant Garamond**, **Playfair Display**, and **DM Sans**.
  - Bespoke procedural book cover generator for volumes added without an image, featuring embossed titles and spine highlights.

- **Home — The Reader's Dashboard**
  - Dynamic personalized greeting adapting to morning, afternoon, or evening.
  - Curated daily epigraph with interactive refresh.
  - 4 editorial summary blocks: Books completed this year, volumes currently open, annual goal progress, and genuine reading streak calculation.
  - *Currently on your nightstand*: interactive progress updater and quick session logger.
  - *Recently finished*: horizontal book shelf with ratings and completion dates.
  - *Reading inspiration*: book recommendations pulled directly from your own want-to-read collection.

- **My Bookshelf**
  - Dual viewing modes: **Bookshelf Grid View** (book cover focus with physical spine shadow) & **List View** (comprehensive editorial table).
  - Multi-level filtering by reading status (*Currently Reading, Want to Read, Completed, On Hold, Abandoned*), genre, and star rating.
  - Functional instant search across title, author, genre, and personal tags.
  - Sorting by recently added, title A–Z, author A–Z, highest rated, and recently completed.

- **Book Detail & Immersive Volume View**
  - Full volume breakdown: cover art, synopsis, genres, page counts, dates started and finished.
  - Interactive reading progress slider and page input with automatic completion recognition and celebratory confetti.
  - *My Thoughts*: on-the-fly personal review and impression editor.
  - *Favourite Quotes*: collectible quote keepsakes with page numbers and personal reflections.

- **Reading Journal & Keepsakes**
  - Chronological reading diary with custom moods (*Cozy, Reflective, Inspired, Melancholic, Excited, Heartbroken*).
  - Link reflections to specific books on your shelf or write general literary thoughts.
  - Dedicated **Quote Collection** tab with one-click clipboard copying.

- **Reading Statistics & Heatmap**
  - Visual analytics powered by Recharts, styled with the vintage paper palette.
  - Monthly books completed bar chart.
  - Genre distribution donut chart.
  - Rating distribution breakdown.
  - **14-Week Reading Activity Heatmap** derived from actual logged sessions.

- **Reading Goals & Wooden Bookshelf Tracker**
  - Configurable annual reading target with pace estimation (*"Ahead of Pace", "On Track", "Steady Pace"*).
  - Interactive **Visual Wooden Bookshelf** displaying each finished book as an embossed bound spine on a shelf.

- **Zero-Backend Persistence & Portability**
  - Automatic `localStorage` synchronization.
  - Complete JSON Library Export & Import with structural validation.
  - One-click Sample Library Reset and Clean Library options.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Animations**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Modular CSS custom design system with CSS custom properties, responsive flex/grid layouts, and accessibility adjustments.

---

## 📁 Project Structure

```
Chapter & Co/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── App.jsx                     # Root application container & modal router
│   ├── main.jsx                    # Application entry point
│   ├── components/
│   │   ├── BookCard.jsx            # Grid & List book card views
│   │   ├── BookCover.jsx           # Image loader with bespoke fallback cover generator
│   │   ├── BookDetailModal.jsx     # Deep volume view, reviews, and quotes
│   │   ├── BookModal.jsx           # Add & Edit volume form with presets & validation
│   │   ├── ConfirmModal.jsx        # Deletion confirmation dialog
│   │   ├── EmptyState.jsx          # Warm empty state with bookish line motifs
│   │   ├── JournalModal.jsx        # Diary entry form with mood selection
│   │   ├── LogSessionModal.jsx     # Daily reading session logger
│   │   ├── Navbar.jsx              # Responsive mobile top header & bottom nav
│   │   ├── ProgressBar.jsx         # Paper styled progress indicator
│   │   ├── Sidebar.jsx             # Editorial desktop sidebar & data menu
│   │   └── Toast.jsx               # Floating notification toasts
│   ├── context/
│   │   └── LibraryContext.jsx      # Global React context with CRUD & storage sync
│   ├── data/
│   │   └── sampleData.js           # Curated classic library, sessions, & epigraphs
│   ├── pages/
│   │   ├── Bookshelf.jsx           # Library browsing, filters, search, & sorting
│   │   ├── Goals.jsx               # Annual reading goals & wooden spine shelf
│   │   ├── Home.jsx                # Reader's Dashboard & nightstand
│   │   ├── Journal.jsx             # Literary reflections & collectible quotes
│   │   └── Statistics.jsx          # Recharts charts & reading activity heatmap
│   ├── styles/
│   │   ├── global.css              # Reset, typography, card styles, and animations
│   │   └── variables.css           # Palette tokens, shadows, and radii
│   └── utils/
│       ├── dates.js                # Editorial date helpers & formatting
│       ├── statistics.js           # Streak, pace, heatmap, and chart aggregators
│       └── storage.js              # LocalStorage handling, JSON export & import
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or pnpm

### 1. Clone or Navigate to Directory
```bash
cd "Chapter & Co"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port shown in your terminal).

### 4. Build for Production
```bash
npm run build
```

---

## 💾 Data Storage

All user data is stored privately and locally in your browser's `localStorage` under namespaced keys:
- `chapter_co_books`: Your volumes, current progress, ratings, and quotes.
- `chapter_co_journal`: Your reflections, moods, and notes.
- `chapter_co_sessions`: Reading session logs used for streak and heatmap calculations.
- `chapter_co_goal`: Your annual target.
- `chapter_co_profile`: Reader name and avatar.

You can safely export your entire library at any time via the sidebar profile menu (**Export Library JSON**) and restore it on any device via **Import Library (JSON)**.

---

## 📜 License

Distributed under the MIT License. Crafted with love for books and quiet afternoons.
