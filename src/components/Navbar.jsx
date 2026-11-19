import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  Compass,
  BookOpen,
  Feather,
  BarChart2,
  Target,
  Plus,
  Menu,
  X,
  BookMarked
} from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab, setIsAddBookModalOpen } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'bookshelf', label: 'Bookshelf', icon: BookOpen },
    { id: 'journal', label: 'Journal', icon: Feather },
    { id: 'statistics', label: 'Stats', icon: BarChart2 },
    { id: 'goals', label: 'Goals', icon: Target }
  ];

  return (
    <>
      {/* Mobile Top Header (hidden on desktop via CSS) */}
      <header
        className="mobile-header"
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          backgroundColor: '#FAF7F2',
          borderBottom: '1px solid var(--color-border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 60
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              backgroundColor: 'var(--color-burgundy-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-burgundy)'
            }}
          >
            <BookMarked size={16} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--color-espresso)'
            }}
          >
            Chapter &amp; Co.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setIsAddBookModalOpen(true)}
            className="btn-primary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Plus size={15} />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost"
            style={{ padding: '0.4rem' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: '57px',
            backgroundColor: 'rgba(48, 45, 41, 0.4)',
            zIndex: 55,
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FAF7F2',
              borderBottom: '1px solid var(--color-border-warm)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-paper-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                    backgroundColor: isActive ? 'var(--color-burgundy-light)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--color-burgundy)' : '3px solid transparent',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={20} color={isActive ? 'var(--color-burgundy)' : 'var(--color-ink-muted)'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="mobile-bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FAF7F2',
          borderTop: '1px solid var(--color-border-subtle)',
          padding: '0.4rem 0.5rem',
          zIndex: 60,
          justifyContent: 'space-around',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.04)'
        }}
      >
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
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.35rem 0.6rem',
                borderRadius: '4px',
                color: isActive ? 'var(--color-burgundy)' : 'var(--color-ink-muted)',
                fontSize: '0.68rem',
                fontWeight: isActive ? 600 : 400
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Media query stylesheet hook */}
      <style>{`
        @media (max-width: 900px) {
          .app-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
