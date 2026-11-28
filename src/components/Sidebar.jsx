import React, { useState, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  Compass,
  BookOpen,
  Feather,
  BarChart2,
  Target,
  Plus,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  MoreVertical,
  BookMarked,
  User,
  Moon,
  Sun
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    setIsAddBookModalOpen,
    profile,
    handleExport,
    handleImport,
    handleResetToSample,
    handleClearAll,
    theme,
    toggleTheme
  } = useLibrary();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'bookshelf', label: 'My Bookshelf', icon: BookOpen },
    { id: 'journal', label: 'Reading Journal', icon: Feather },
    { id: 'statistics', label: 'Statistics', icon: BarChart2 },
    { id: 'goals', label: 'Reading Goals', icon: Target },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  const onImportClick = () => {
    setIsMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
      e.target.value = '';
    }
  };

  return (
    <aside
      className="app-sidebar"
      style={{
        width: '270px',
        backgroundColor: 'var(--color-paper-light)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 1.4rem 1.5rem',
        boxSizing: 'border-box',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ marginBottom: '2.2rem', paddingLeft: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-burgundy-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-burgundy)',
                boxShadow: 'var(--shadow-paper-sm)'
              }}
            >
              <BookMarked size={18} strokeWidth={2} />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: 'var(--color-espresso)',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1
              }}
            >
              Chapter &amp; Co.
            </h1>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '0.82rem',
              color: 'var(--color-ink-muted)',
              margin: '0.35rem 0 0 2.5rem',
              lineHeight: 1.25
            }}
          >
            A little home for the stories you keep.
          </p>
        </div>

        {/* Primary Action Button */}
        <div style={{ marginBottom: '1.8rem' }}>
          <button
            type="button"
            onClick={() => setIsAddBookModalOpen(true)}
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.92rem' }}
          >
            <Plus size={18} />
            <span>Add a Book</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.65rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                  backgroundColor: isActive ? 'var(--color-burgundy-light)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-burgundy)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left'
                }}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.75}
                  color={isActive ? 'var(--color-burgundy)' : 'var(--color-ink-muted)'}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Candlelight Mode Toggle Button */}
        <div style={{ marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: theme === 'dark' ? 'rgba(201, 122, 132, 0.12)' : 'var(--color-antique-paper)',
              border: '1px solid var(--color-border-warm)',
              color: 'var(--color-espresso)',
              fontSize: '0.84rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            title={theme === 'dark' ? 'Switch to Daybreak Mode' : 'Switch to Candlelight Mode'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {theme === 'dark' ? (
                <Sun size={17} style={{ color: '#D4917B' }} />
              ) : (
                <Moon size={17} style={{ color: 'var(--color-burgundy)' }} />
              )}
              <span>Candlelight Mode</span>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: theme === 'dark' ? 'var(--color-burgundy)' : 'var(--color-ink-muted)',
                fontWeight: 600
              }}
            >
              {theme === 'dark' ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </div>

      {/* Reader Profile & Library Actions Footer */}
      <div style={{ position: 'relative', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isMenuOpen ? 'var(--color-antique-paper)' : 'transparent'
          }}
        >
          <div
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              minWidth: 0,
              cursor: 'pointer',
              flex: 1
            }}
            title="View My Profile"
          >
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--color-border-warm)'
                }}
              />
            ) : (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-burgundy-light)',
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid var(--color-border-warm)'
                }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'B'}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: 'var(--color-espresso)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {profile.name}
              </div>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--color-ink-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {profile.username ? `@${profile.username.replace('@', '')}` : 'Personal Reader'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn-ghost"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
            title="Library Data Settings"
          >
            <MoreVertical size={17} />
          </button>
        </div>

        {/* Hidden File Input for JSON import */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />

        {/* Dropdown Menu for Library Storage & Backup */}
        {isMenuOpen && (
          <div
            className="paper-card"
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              marginBottom: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'var(--color-paper-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-warm)',
              boxShadow: 'var(--shadow-paper-lg)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-ink-faint)',
                padding: '0.4rem 0.6rem 0.2rem'
              }}
            >
              Library Management
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                handleExport();
              }}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                justifyContent: 'flex-start',
                padding: '0.5rem 0.6rem',
                fontSize: '0.84rem'
              }}
            >
              <Download size={15} color="var(--color-sage)" />
              <span>Export Library (JSON)</span>
            </button>

            <button
              type="button"
              onClick={onImportClick}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                justifyContent: 'flex-start',
                padding: '0.5rem 0.6rem',
                fontSize: '0.84rem'
              }}
            >
              <Upload size={15} color="var(--color-terracotta)" />
              <span>Import Library (JSON)</span>
            </button>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '0.3rem 0' }} />

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                handleResetToSample();
              }}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                justifyContent: 'flex-start',
                padding: '0.5rem 0.6rem',
                fontSize: '0.84rem'
              }}
            >
              <RotateCcw size={15} color="var(--color-olive)" />
              <span>Reset Sample Books</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                if (window.confirm('Clear all books, journal entries and reading logs?')) {
                  handleClearAll();
                }
              }}
              className="btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                width: '100%',
                justifyContent: 'flex-start',
                padding: '0.5rem 0.6rem',
                fontSize: '0.84rem',
                color: '#8C3838'
              }}
            >
              <Trash2 size={15} color="#8C3838" />
              <span>Clear Entire Library</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
