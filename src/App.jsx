import React from 'react';
import { useLibrary } from './context/LibraryContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Bookshelf from './pages/Bookshelf';
import Journal from './pages/Journal';
import Statistics from './pages/Statistics';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import BookDetailModal from './components/BookDetailModal';
import BookModal from './components/BookModal';
import LogSessionModal from './components/LogSessionModal';
import Toast from './components/Toast';

export default function App() {
  const {
    activeTab,
    selectedBook,
    setSelectedBook,
    isAddBookModalOpen,
    setIsAddBookModalOpen,
    bookToEdit,
    setBookToEdit
  } = useLibrary();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'bookshelf':
        return <Bookshelf />;
      case 'journal':
        return <Journal />;
      case 'statistics':
        return <Statistics />;
      case 'goals':
        return <Goals />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  const handleEditBook = (book) => {
    setBookToEdit(book);
    setIsAddBookModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Desktop Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Navigation Header */}
        <Navbar />

        <main className="main-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onEdit={handleEditBook}
        />
      )}

      <BookModal
        isOpen={isAddBookModalOpen}
        onClose={() => {
          setIsAddBookModalOpen(false);
          setBookToEdit(null);
        }}
        bookToEdit={bookToEdit}
      />

      <LogSessionModal />

      {/* Global Toasts */}
      <Toast />
    </div>
  );
}
