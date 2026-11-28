import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ProfileEditModal from '../components/ProfileEditModal';
import FavouriteModal from '../components/FavouriteModal';
import ConfirmModal from '../components/ConfirmModal';
import { formatDate } from '../utils/dates';
import { calculateReadingStreak, calculateTotalPagesRead } from '../utils/statistics';
import {
  User,
  Edit3,
  Camera,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Quote,
  BookOpen,
  Feather,
  Bookmark,
  UserCheck,
  Layers,
  Film,
  Tv,
  Music,
  Disc,
  Palette,
  Coffee,
  Compass,
  Globe,
  Sparkles,
  Clock,
  Plus,
  Trash2,
  RotateCcw,
  Heart,
  CheckCircle,
  Flame,
  Check
} from 'lucide-react';

// Icon mapping dictionary for favourites
const ICON_MAP = {
  BookOpen,
  Feather,
  Bookmark,
  UserCheck,
  Layers,
  Film,
  Tv,
  Music,
  Disc,
  Palette,
  Coffee,
  Compass,
  Globe,
  Heart,
  Sparkles
};

export default function Profile() {
  const { profile, updateProfile, resetProfile, books, sessions } = useLibrary();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFavModalOpen, setIsFavModalOpen] = useState(false);
  const [selectedFavToEdit, setSelectedFavToEdit] = useState(null);
  const [favToDelete, setFavToDelete] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Derive live statistics
  const completedBooks = books.filter((b) => b.status === 'completed');
  const currentlyReading = books.filter((b) => b.status === 'currently-reading');
  const streak = calculateReadingStreak(sessions);
  const totalPages = calculateTotalPagesRead(books, sessions);

  // Favourites operations
  const handleSaveFavourite = (favItem) => {
    const existing = profile.favourites || [];
    const index = existing.findIndex((f) => f.id === favItem.id);
    let updated;
    if (index >= 0) {
      updated = existing.map((f) => (f.id === favItem.id ? favItem : f));
    } else {
      updated = [...existing, favItem];
    }
    updateProfile({ favourites: updated });
  };

  const handleConfirmDeleteFav = () => {
    if (!favToDelete) return;
    const updated = (profile.favourites || []).filter((f) => f.id !== favToDelete.id);
    updateProfile({ favourites: updated });
    setFavToDelete(null);
  };

  const usernameDisplay = profile.username
    ? `@${profile.username.replace('@', '')}`
    : '@reader';

  return (
    <div className="profile-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* 1. PROFILE HEADER SECTION */}
      <section
        className="paper-card profile-header-card"
        style={{
          padding: '2.5rem',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-warm)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-paper-lg)',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap'
          }}
          className="profile-header-content"
        >
          {/* Avatar with Camera Overlay */}
          <div style={{ position: 'relative', flexShrink: 0, margin: '0 auto' }}>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                style={{
                  width: '145px',
                  height: '145px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--color-paper-light)',
                  boxShadow: '0 4px 18px rgba(69, 55, 47, 0.16)',
                  backgroundColor: 'var(--color-antique-paper)',
                  display: 'block'
                }}
              />
            ) : (
              <div
                style={{
                  width: '145px',
                  height: '145px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-burgundy-light)',
                  color: 'var(--color-burgundy)',
                  border: '4px solid var(--color-paper-light)',
                  boxShadow: '0 4px 18px rgba(69, 55, 47, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3.5rem',
                  fontWeight: 600
                }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'B'}
              </div>
            )}

            {/* Quick Change Photo Button */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-burgundy)',
                color: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(113, 61, 70, 0.35)',
                border: '2px solid var(--color-paper-light)',
                transition: 'transform var(--transition-fast)'
              }}
              title="Change Profile Photo"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* User Identity & Info */}
          <div style={{ flex: '1 1 320px', minWidth: 0 }} className="profile-header-text">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '0.4rem'
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.4rem',
                    fontWeight: 700,
                    color: 'var(--color-espresso)',
                    letterSpacing: '-0.02em',
                    margin: '0 0 0.15rem 0',
                    lineHeight: 1.15
                  }}
                >
                  {profile.name}
                </h1>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    fontSize: '0.92rem',
                    color: 'var(--color-burgundy)',
                    fontWeight: 500
                  }}
                >
                  <span>{usernameDisplay}</span>
                  {profile.age && (
                    <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.84rem' }}>
                      • {profile.age} years of age
                    </span>
                  )}
                  {profile.location && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: 'var(--color-ink-muted)',
                        fontSize: '0.84rem'
                      }}
                    >
                      • <MapPin size={13} color="var(--color-terracotta)" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Profile Action */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="btn-primary"
                style={{ fontSize: '0.88rem', padding: '0.55rem 1.15rem' }}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Personal Tagline */}
            {profile.tagline && (
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.18rem',
                  color: 'var(--color-espresso-light)',
                  margin: '0.75rem 0 1.25rem 0',
                  lineHeight: 1.45
                }}
              >
                "{profile.tagline}"
              </p>
            )}

            {/* Reader Stats Ribbon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--color-border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--color-ink-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={15} color="var(--color-burgundy)" />
                <span>
                  <strong style={{ color: 'var(--color-espresso)', fontSize: '0.94rem' }}>
                    {completedBooks.length}
                  </strong>{' '}
                  finished
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={15} color="var(--color-olive)" />
                <span>
                  <strong style={{ color: 'var(--color-espresso)', fontSize: '0.94rem' }}>
                    {currentlyReading.length}
                  </strong>{' '}
                  in progress
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Flame size={15} color="#C28B47" />
                <span>
                  <strong style={{ color: 'var(--color-espresso)', fontSize: '0.94rem' }}>
                    {streak}
                  </strong>{' '}
                  day streak
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={15} color="var(--color-terracotta)" />
                <span>
                  <strong style={{ color: 'var(--color-espresso)', fontSize: '0.94rem' }}>
                    {profile.favourites?.length || 0}
                  </strong>{' '}
                  favourites
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT ME & PERSONAL QUOTE GRID */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '1.75rem',
          alignItems: 'start'
        }}
        className="profile-about-grid"
      >
        {/* Left Column: Bio & Details */}
        <div
          className="paper-card"
          style={{
            padding: '2rem 2.25rem',
            backgroundColor: '#FAF7F2',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '0.65rem'
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                color: 'var(--color-espresso)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <User size={18} color="var(--color-burgundy)" />
              About Me
            </h2>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="btn-ghost"
              style={{ fontSize: '0.78rem' }}
            >
              <Edit3 size={13} />
              Edit Details
            </button>
          </div>

          {/* Bio paragraph */}
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.08rem',
              lineHeight: 1.65,
              color: 'var(--color-ink)',
              margin: '0 0 1.5rem 0'
            }}
          >
            {profile.bio || 'No bio written yet. Click edit to pen your story.'}
          </p>

          {/* Details Table */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              backgroundColor: 'var(--bg-muted)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                Full Name
              </span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                {profile.name}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                Username
              </span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--color-burgundy)' }}>
                {usernameDisplay}
              </strong>
            </div>

            {profile.occupation && (
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                  Occupation
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                  {profile.occupation}
                </strong>
              </div>
            )}

            {profile.education && (
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                  Education
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                  {profile.education}
                </strong>
              </div>
            )}

            {profile.dateOfBirth && (
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                  Date of Birth
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                  {formatDate(profile.dateOfBirth)}
                </strong>
              </div>
            )}

            {profile.gender && (
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                  Gender
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                  {profile.gender}
                </strong>
              </div>
            )}

            {profile.location && (
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                  Location
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                  {profile.location}
                </strong>
              </div>
            )}

            {profile.favoriteBookstore && (
              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-muted)', display: 'block' }}>
                  Favourite Bookstore
                </span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-espresso)' }}>
                  {profile.favoriteBookstore}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Decorative Favourite Quote Keepsake */}
        <div
          className="paper-card"
          style={{
            padding: '2rem',
            backgroundColor: '#FAF7F2',
            border: '1px solid var(--color-border-warm)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            minHeight: '260px'
          }}
        >
          {/* Inner frame */}
          <div
            style={{
              position: 'absolute',
              inset: '8px',
              border: '1px dashed var(--color-border-warm)',
              borderRadius: 'var(--radius-md)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Quote size={20} color="var(--color-terracotta)" />
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-burgundy)', fontWeight: 600 }}>
                  Personal Guiding Line
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="btn-ghost"
                style={{ padding: '0.2rem', color: 'var(--color-ink-muted)' }}
                title="Edit Quote"
              >
                <Edit3 size={13} />
              </button>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.22rem',
                lineHeight: 1.55,
                color: 'var(--color-espresso)',
                margin: '0 0 1rem 0'
              }}
            >
              "{profile.personalQuote || 'I declare after all there is no enjoyment like reading!'}"
            </p>
          </div>

          <div style={{ textAlign: 'right', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.92rem',
                color: 'var(--color-terracotta)',
                fontWeight: 600
              }}
            >
              — {profile.personalQuoteAuthor || 'Jane Austen'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. MY READING PERSONALITY */}
      <section
        className="paper-card"
        style={{
          padding: '2.25rem',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.75rem'
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.2rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Sparkles size={20} color="var(--color-terracotta)" />
              My Reading Personality
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: 0 }}>
              The ritual, atmosphere, and rhythm behind your literary life.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="btn-outline"
            style={{ fontSize: '0.82rem' }}
          >
            <Edit3 size={13} />
            Edit Personality
          </button>
        </div>

        {/* Archetype Feature Banner */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--color-burgundy)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-burgundy)', fontWeight: 600 }}>
              Literary Archetype
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.55rem',
              color: 'var(--color-espresso)',
              margin: '0 0 0.45rem 0'
            }}
          >
            {profile.readingPersonality?.readerType || 'The Atmospheric Escapist'}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--color-ink-muted)',
              fontStyle: 'italic',
              margin: 0
            }}
          >
            {profile.readingPersonality?.personalityDescription ||
              'You read for sanctuary and slow living. You savor every sentence, frequently pause to admire beautiful turns of phrase, and keep dried flowers between your favorite chapters.'}
          </p>
        </div>

        {/* 4 Attributes Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {/* 1: Leading Genre */}
          <div
            style={{
              padding: '1.15rem',
              backgroundColor: 'var(--color-paper-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Favourite Genre
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Bookmark size={16} color="var(--color-burgundy)" />
              <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.12rem', color: 'var(--color-espresso)' }}>
                {profile.readingPersonality?.favouriteGenre || 'Gothic Fiction & Romance'}
              </strong>
            </div>
          </div>

          {/* 2: Reading Time */}
          <div
            style={{
              padding: '1.15rem',
              backgroundColor: 'var(--color-paper-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Preferred Reading Hour
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Clock size={16} color="var(--color-olive)" />
              <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.12rem', color: 'var(--color-espresso)' }}>
                {profile.readingPersonality?.readingTime || 'Late evenings by warm lamplight'}
              </strong>
            </div>
          </div>

          {/* 3: Format Preference */}
          <div
            style={{
              padding: '1.15rem',
              backgroundColor: 'var(--color-paper-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Format Preference
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BookOpen size={16} color="var(--color-terracotta)" />
              <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.12rem', color: 'var(--color-espresso)' }}>
                {profile.readingPersonality?.formatPreference || 'Physical Books (Hardcovers)'}
              </strong>
            </div>
          </div>

          {/* 4: Reading Atmosphere */}
          <div
            style={{
              padding: '1.15rem',
              backgroundColor: 'var(--color-paper-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Ideal Atmosphere
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <Coffee size={16} color="#B07530" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.96rem', color: 'var(--color-espresso)', lineHeight: 1.35 }}>
                {profile.readingPersonality?.readingAtmosphere || 'Armchair beside a rainy bay window with hot tea'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MY FAVOURITES GRID */}
      <section
        className="paper-card"
        style={{
          padding: '2.25rem',
          backgroundColor: '#FAF7F2',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                color: 'var(--color-espresso)',
                margin: '0 0 0.2rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Heart size={20} color="var(--color-burgundy)" />
              My Favourites
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--color-ink-muted)', margin: 0 }}>
              The stories, melodies, tastes, and universes that feel like home.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedFavToEdit(null);
              setIsFavModalOpen(true);
            }}
            className="btn-primary"
            style={{ fontSize: '0.84rem', padding: '0.45rem 0.95rem' }}
          >
            <Plus size={15} />
            <span>Add Favourite</span>
          </button>
        </div>

        {/* Favourites Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {profile.favourites && profile.favourites.length > 0 ? (
            profile.favourites.map((fav) => {
              const IconComponent = ICON_MAP[fav.icon] || Heart;

              return (
                <div
                  key={fav.id}
                  className="paper-card favourite-item-card"
                  style={{
                    padding: '1.15rem 1.25rem',
                    backgroundColor: 'var(--color-paper-card)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-paper-lift)';
                    e.currentTarget.style.borderColor = 'var(--color-border-warm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-paper)';
                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  }}
                >
                  <div>
                    {/* Header: Category Badge & Actions */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <IconComponent size={14} color="var(--color-burgundy)" />
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            color: 'var(--color-espresso-light)'
                          }}
                        >
                          {fav.category}
                        </span>
                      </div>

                      {/* Card Edit/Delete Actions */}
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFavToEdit(fav);
                            setIsFavModalOpen(true);
                          }}
                          className="btn-ghost"
                          style={{ padding: '0.25rem' }}
                          title="Edit favourite"
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setFavToDelete(fav)}
                          className="btn-ghost"
                          style={{ padding: '0.25rem', color: '#8C3838' }}
                          title="Remove favourite"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Value */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      {fav.color && (
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: fav.color,
                            border: '1px solid var(--color-border-warm)',
                            flexShrink: 0
                          }}
                        />
                      )}
                      <h4
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.22rem',
                          fontWeight: 600,
                          color: 'var(--color-espresso)',
                          margin: 0,
                          lineHeight: 1.25
                        }}
                      >
                        {fav.value}
                      </h4>
                    </div>
                  </div>

                  {/* Note / Detail */}
                  {fav.note && (
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontSize: '0.84rem',
                        color: 'var(--color-ink-muted)',
                        margin: '0.5rem 0 0 0',
                        lineHeight: 1.35
                      }}
                    >
                      {fav.note}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--color-ink-muted)', fontStyle: 'italic' }}>
              No favourites added yet. Press "Add Favourite" to build your showcase!
            </div>
          )}
        </div>
      </section>

      {/* EDIT PROFILE MODAL */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* EDIT / ADD INDIVIDUAL FAVOURITE MODAL */}
      <FavouriteModal
        isOpen={isFavModalOpen}
        onClose={() => {
          setIsFavModalOpen(false);
          setSelectedFavToEdit(null);
        }}
        favToEdit={selectedFavToEdit}
        onSave={handleSaveFavourite}
      />

      {/* DELETE FAVOURITE CONFIRMATION */}
      <ConfirmModal
        isOpen={Boolean(favToDelete)}
        title="Remove Favourite?"
        message={`Remove "${favToDelete?.category}: ${favToDelete?.value}" from your favourites showcase?`}
        confirmText="Remove"
        cancelText="Keep"
        onConfirm={handleConfirmDeleteFav}
        onCancel={() => setFavToDelete(null)}
      />

      {/* STYLES FOR RESPONSIVENESS */}
      <style>{`
        @media (max-width: 900px) {
          .profile-about-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .profile-header-content {
            flex-direction: column !important;
            text-align: center !important;
          }
          .profile-header-text div {
            justify-content: center !important;
          }
          .profile-header-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
