import React, { useState, useEffect, useRef } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  READER_TYPE_OPTIONS,
  READING_TIME_OPTIONS,
  FORMAT_PREFERENCE_OPTIONS
} from '../data/sampleData';
import ConfirmModal from './ConfirmModal';
import {
  X,
  Upload,
  Camera,
  Trash2,
  Plus,
  RotateCcw,
  User,
  BookOpen,
  Heart,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ProfileEditModal({ isOpen, onClose }) {
  const { profile, updateProfile, resetProfile, showToast } = useLibrary();

  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'personality' | 'favourites'
  const [formData, setFormData] = useState({ ...profile });
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar || '');
  const [imageError, setImageError] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  // State for adding a new favourite in modal
  const [newFav, setNewFav] = useState({ category: '', value: '', note: '', color: '' });
  const [isAddingFav, setIsAddingFav] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...profile,
        readingPersonality: { ...(profile.readingPersonality || {}) },
        favourites: Array.isArray(profile.favourites) ? [...profile.favourites] : []
      });
      setAvatarPreview(profile.avatar || '');
      setImageError('');
      setIsAddingFav(false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Handle Photo upload with format & size validation
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');

    // Valid formats: JPEG, PNG, WEBP
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please select a JPG, PNG, or WEBP image file.');
      return;
    }

    // Size limit: 2MB to ensure clean localStorage persistence
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError('Image file is too large. Please select a photo under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setAvatarPreview(base64);
      setFormData((prev) => ({ ...prev, avatar: base64 }));
    };
    reader.onerror = () => {
      setImageError('Failed to read the image file. Please try another.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPreview('');
    setFormData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Favourites management inside modal
  const handleFavChange = (id, field, val) => {
    setFormData((prev) => ({
      ...prev,
      favourites: prev.favourites.map((f) => (f.id === id ? { ...f, [field]: val } : f))
    }));
  };

  const handleDeleteFav = (id) => {
    setFormData((prev) => ({
      ...prev,
      favourites: prev.favourites.filter((f) => f.id !== id)
    }));
  };

  const handleAddNewFav = (e) => {
    e.preventDefault();
    if (!newFav.category.trim() || !newFav.value.trim()) return;

    const newItem = {
      id: 'fav-' + Date.now(),
      category: newFav.category.trim(),
      value: newFav.value.trim(),
      note: newFav.note.trim(),
      color: newFav.color.trim() || undefined,
      icon: 'Heart'
    };

    setFormData((prev) => ({
      ...prev,
      favourites: [...prev.favourites, newItem]
    }));

    setNewFav({ category: '', value: '', note: '', color: '' });
    setIsAddingFav(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }

    updateProfile(formData);
    onClose();
  };

  const handleConfirmReset = () => {
    resetProfile();
    setIsResetConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          backgroundColor: 'rgba(48, 45, 41, 0.55)',
          backdropFilter: 'blur(3px)',
          animation: 'modalBackdrop 0.2s ease forwards'
        }}
        onClick={onClose}
      >
        <div
          className="paper-card"
          style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'var(--color-paper-light)',
            border: '1px solid var(--color-border-warm)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-paper-lg)',
            padding: '2rem 2.25rem',
            animation: 'modalContent 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              paddingBottom: '0.85rem'
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.85rem',
                  color: 'var(--color-espresso)',
                  margin: '0 0 0.2rem 0'
                }}
              >
                Edit Reader Profile
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                  color: 'var(--color-ink-muted)',
                  margin: 0
                }}
              >
                Personalize your literary identity, reading habits, and cherished favourites.
              </p>
            </div>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '0.35rem' }}>
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'about' ? 600 : 400,
                backgroundColor: activeTab === 'about' ? 'var(--color-burgundy-light)' : 'transparent',
                color: activeTab === 'about' ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                borderBottom: activeTab === 'about' ? '2px solid var(--color-burgundy)' : '2px solid transparent'
              }}
            >
              <User size={15} />
              <span>About &amp; Header</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('personality')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'personality' ? 600 : 400,
                backgroundColor: activeTab === 'personality' ? 'var(--color-burgundy-light)' : 'transparent',
                color: activeTab === 'personality' ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                borderBottom: activeTab === 'personality' ? '2px solid var(--color-burgundy)' : '2px solid transparent'
              }}
            >
              <Sparkles size={15} />
              <span>Reading Personality</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favourites')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: activeTab === 'favourites' ? 600 : 400,
                backgroundColor: activeTab === 'favourites' ? 'var(--color-burgundy-light)' : 'transparent',
                color: activeTab === 'favourites' ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                borderBottom: activeTab === 'favourites' ? '2px solid var(--color-burgundy)' : '2px solid transparent'
              }}
            >
              <Heart size={15} />
              <span>My Favourites ({formData.favourites?.length || 0})</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* TAB 1: ABOUT & HEADER */}
            {activeTab === 'about' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Photo Upload Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '1.1rem',
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile preview"
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--color-border-warm)',
                          boxShadow: 'var(--shadow-paper)'
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-burgundy-light)',
                          color: 'var(--color-burgundy)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-serif)',
                          fontSize: '2rem',
                          fontWeight: 600,
                          border: '2px solid var(--color-border-warm)'
                        }}
                      >
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'B'}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary"
                        style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
                      >
                        <Camera size={14} />
                        Upload New Photo
                      </button>

                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="btn-ghost"
                          style={{ fontSize: '0.8rem', color: '#8C3838' }}
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/jpeg, image/png, image/webp"
                      style={{ display: 'none' }}
                    />

                    <p style={{ fontSize: '0.74rem', color: 'var(--color-ink-muted)', margin: 0 }}>
                      Supports JPG, PNG, and WEBP formats up to 2MB. Stored locally.
                    </p>

                    {imageError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#A33232', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                        <AlertCircle size={13} />
                        <span>{imageError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Username */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username (@)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.username || ''}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.replace('@', '') })}
                      placeholder="e.g. eleanor.reads"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div className="form-group">
                  <label className="form-label">Personal Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Lost between the pages of 19th-century novels and cups of Earl Grey."
                  />
                </div>

                {/* Age, DOB, Gender */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      className="form-input"
                      value={formData.age || ''}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 26"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth (Optional)</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.dateOfBirth || ''}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.gender || ''}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      placeholder="e.g. Female / Non-binary"
                    />
                  </div>
                </div>

                {/* Location, Occupation, Education */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Location (City, Country)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Edinburgh, Scotland"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Occupation / Profession</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.occupation || ''}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      placeholder="e.g. Literary Archivist & Conservator"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Education (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.education || ''}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="e.g. M.A. in English Literature, University of Edinburgh"
                  />
                </div>

                {/* Bio */}
                <div className="form-group">
                  <label className="form-label">About Me / Personal Bio</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Write a little about your reading life, stationery obsessions, favorite afternoon routines..."
                  />
                </div>

                {/* Personal Quote */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Favourite Personal Quote</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.personalQuote || ''}
                      onChange={(e) => setFormData({ ...formData, personalQuote: e.target.value })}
                      placeholder="e.g. There is no friend as loyal as a book."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quote Attribution</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.personalQuoteAuthor || ''}
                      onChange={(e) => setFormData({ ...formData, personalQuoteAuthor: e.target.value })}
                      placeholder="e.g. Ernest Hemingway"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: READING PERSONALITY */}
            {activeTab === 'personality' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">What kind of reader am I? (Literary Archetype)</label>
                  <select
                    className="form-select"
                    value={formData.readingPersonality?.readerType || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readingPersonality: {
                          ...(formData.readingPersonality || {}),
                          readerType: e.target.value
                        }
                      })
                    }
                  >
                    {READER_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Favourite Reading Genre</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.readingPersonality?.favouriteGenre || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          readingPersonality: {
                            ...(formData.readingPersonality || {}),
                            favouriteGenre: e.target.value
                          }
                        })
                      }
                      placeholder="e.g. Gothic Fiction & Classic Romance"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Favourite Reading Time</label>
                    <select
                      className="form-select"
                      value={formData.readingPersonality?.readingTime || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          readingPersonality: {
                            ...(formData.readingPersonality || {}),
                            readingTime: e.target.value
                          }
                        })
                      }
                    >
                      {READING_TIME_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Format</label>
                  <select
                    className="form-select"
                    value={formData.readingPersonality?.formatPreference || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readingPersonality: {
                          ...(formData.readingPersonality || {}),
                          formatPreference: e.target.value
                        }
                      })
                    }
                  >
                    {FORMAT_PREFERENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Favourite Reading Atmosphere</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={formData.readingPersonality?.readingAtmosphere || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readingPersonality: {
                          ...(formData.readingPersonality || {}),
                          readingAtmosphere: e.target.value
                        }
                      })
                    }
                    placeholder="Describe your ideal setting (e.g. rainy bay window, crackling fire, hot tea)..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reading Personality Description</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={formData.readingPersonality?.personalityDescription || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readingPersonality: {
                          ...(formData.readingPersonality || {}),
                          personalityDescription: e.target.value
                        }
                      })
                    }
                    placeholder="A short reflection on how and why you read..."
                  />
                </div>
              </div>
            )}

            {/* TAB 3: MY FAVOURITES */}
            {activeTab === 'favourites' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                    Edit existing favourites or add new cherished items to your showcase.
                  </span>
                  {!isAddingFav && (
                    <button
                      type="button"
                      onClick={() => setIsAddingFav(true)}
                      className="btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Plus size={14} />
                      Add Favourite
                    </button>
                  )}
                </div>

                {/* Subform to add a new favourite */}
                {isAddingFav && (
                  <div
                    style={{
                      padding: '1.1rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-warm)'
                    }}
                  >
                    <h4 style={{ margin: '0 0 0.8rem 0', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                      Add New Favourite
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Category (e.g. Favourite Poem)"
                        value={newFav.category}
                        onChange={(e) => setNewFav({ ...newFav, category: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Value (e.g. The Road Not Taken)"
                        value={newFav.value}
                        onChange={(e) => setNewFav({ ...newFav, value: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Optional note / why (e.g. Robert Frost's cadence)"
                        value={newFav.note}
                        onChange={(e) => setNewFav({ ...newFav, note: e.target.value })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Color hex (optional)"
                        value={newFav.color}
                        onChange={(e) => setNewFav({ ...newFav, color: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsAddingFav(false)}
                        className="btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNewFav}
                        className="btn-primary"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                      >
                        Save Item
                      </button>
                    </div>
                  </div>
                )}

                {/* List of current favourites */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {formData.favourites?.map((fav) => (
                    <div
                      key={fav.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 1fr 1fr auto',
                        gap: '0.75rem',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'var(--color-paper-card)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                        {fav.category}
                      </span>

                      <input
                        type="text"
                        className="form-input"
                        value={fav.value || ''}
                        onChange={(e) => handleFavChange(fav.id, 'value', e.target.value)}
                        placeholder="Value"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.84rem' }}
                      />

                      <input
                        type="text"
                        className="form-input"
                        value={fav.note || ''}
                        onChange={(e) => handleFavChange(fav.id, 'note', e.target.value)}
                        placeholder="Note / detail"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.84rem' }}
                      />

                      <button
                        type="button"
                        onClick={() => handleDeleteFav(fav.id)}
                        className="btn-ghost"
                        style={{ padding: '0.3rem', color: '#8C3838' }}
                        title="Remove favourite"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2rem',
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="btn-ghost"
                style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}
              >
                <RotateCcw size={14} />
                <span>Reset to Defaults</span>
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Profile */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Restore Default Profile?"
        message="This will reset your personal details, bio, reading personality, and favourites back to the default Eleanor Vance literary profile."
        confirmText="Reset Profile"
        cancelText="Cancel"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
        isDestructive={false}
      />
    </>
  );
}
