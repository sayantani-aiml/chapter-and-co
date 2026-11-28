import React from 'react';

export const PROP_CATALOG = [
  { id: 'bookend', label: 'Brass Bookend', defaultSide: 'right', defaultShelf: 'last' },
  { id: 'candle', label: 'Flickering Candle', defaultSide: 'right', defaultShelf: 'last' },
  { id: 'plant', label: 'Potted Trailing Plant', defaultSide: 'right', defaultShelf: 'first' },
  { id: 'teacup', label: 'Steaming Teacup', defaultSide: 'left', defaultShelf: 'last' },
  { id: 'hourglass', label: 'Mini Hourglass', defaultSide: 'left', defaultShelf: 'first' },
  { id: 'clock', label: 'Vintage Alarm Clock', defaultSide: 'right', defaultShelf: 'middle' },
  { id: 'quote', label: 'Framed Mini Quote', defaultSide: 'left', defaultShelf: 'middle' }
];

export const DEFAULT_SHELF_STUDIO = {
  woodFinish: 'walnut', // 'walnut' | 'oak' | 'mahogany'
  spotlight: true,
  fairyLights: false,
  props: [
    { id: 'bookend', enabled: true, side: 'right', shelf: 'last' },
    { id: 'plant', enabled: true, side: 'right', shelf: 'last' },
    { id: 'candle', enabled: true, side: 'right', shelf: 'last' },
    { id: 'teacup', enabled: false, side: 'left', shelf: 'last' },
    { id: 'hourglass', enabled: false, side: 'left', shelf: 'first' },
    { id: 'clock', enabled: false, side: 'right', shelf: 'first' },
    { id: 'quote', enabled: false, side: 'left', shelf: 'first' }
  ]
};

export function BrassBookend() {
  return (
    <div className="shelf-prop-item decor-bookend" aria-hidden="true" title="Brass Bookend">
      <svg width="28" height="94" viewBox="0 0 28 94" fill="none">
        <defs>
          <linearGradient id="brassBody" x1="0" y1="0" x2="28" y2="94" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F2D98A" />
            <stop offset="35%" stopColor="#C89B3C" />
            <stop offset="75%" stopColor="#9A7022" />
            <stop offset="100%" stopColor="#6D4D14" />
          </linearGradient>
          <linearGradient id="brassEdge" x1="0" y1="0" x2="0" y2="94" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF0B8" />
            <stop offset="100%" stopColor="#8C641D" />
          </linearGradient>
        </defs>
        {/* Contact shadow */}
        <ellipse cx="14" cy="91.5" rx="12" ry="2.2" fill="rgba(18, 12, 8, 0.45)" />
        {/* Base plate */}
        <rect x="2" y="85" width="24" height="6" rx="1.5" fill="url(#brassBody)" stroke="#5E4110" strokeWidth="0.7" />
        {/* Vertical arch */}
        <path
          d="M5 85V22C5 13 11.5 8 16 8C20.5 8 22.5 12 22.5 18.5V85H5Z"
          fill="url(#brassBody)"
          stroke="#5E4110"
          strokeWidth="0.8"
        />
        {/* Specular left bevel */}
        <path d="M6.5 84V23C6.5 15 11.5 10.5 15 10" stroke="url(#brassEdge)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        {/* Decorative cut-out arch */}
        <path
          d="M10.5 85V35C10.5 30 12.8 27 15 27C17.2 27 18 30 18 35V85"
          fill="rgba(30, 20, 12, 0.34)"
          stroke="rgba(255, 232, 165, 0.35)"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}

export function PottedPlant() {
  return (
    <div className="shelf-prop-item decor-plant" aria-hidden="true" title="Potted Trailing Plant">
      {/* Height extends slightly below baseline so vines drape over the wooden plank edge */}
      <svg width="52" height="92" viewBox="0 0 52 92" fill="none" style={{ marginBottom: '-16px' }}>
        <defs>
          <linearGradient id="potGrad" x1="12" y1="42" x2="40" y2="74" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D38F76" />
            <stop offset="50%" stopColor="#B46F57" />
            <stop offset="100%" stopColor="#854B37" />
          </linearGradient>
        </defs>
        {/* Contact shadow on shelf */}
        <ellipse cx="26" cy="74.5" rx="13" ry="2.6" fill="rgba(18, 12, 8, 0.45)" />
        {/* Back leaves */}
        <path d="M26 44C23 30 14 23 8 17C16 18 24 26 26 44Z" fill="#5B6950" />
        <path d="M26 44C29 28 37 22 44 16C36 18 28 26 26 44Z" fill="#6F8064" />
        <path d="M26 44C24 27 26 15 26 7C29 15 29 27 26 44Z" fill="#4E5B45" />
        {/* Front highlight leaves */}
        <path d="M26 44C20 35 13 33 7 31C14 32 22 36 26 44Z" fill="#899581" />
        <path d="M26 44C32 35 39 33 45 31C38 32 30 36 26 44Z" fill="#9AA891" />
        <path d="M26 44C23 33 19 25 16 19C21 24 24 33 26 44Z" fill="#7D8C73" />
        {/* Terracotta Pot */}
        <path d="M14 46H38L34.5 73H17.5L14 46Z" fill="url(#potGrad)" stroke="#7A4431" strokeWidth="0.9" />
        {/* Pot Rim */}
        <rect x="12" y="42" width="28" height="5.5" rx="1.6" fill="#C9846B" stroke="#7A4431" strokeWidth="0.9" />
        <line x1="14" y1="43.5" x2="36" y2="43.5" stroke="rgba(255, 232, 220, 0.4)" strokeWidth="0.9" />
        {/* Trailing vines draping over the front edge of the wooden plank */}
        <path d="M15 47C9 52 7 63 9 75C10 81 8 86 6 89" stroke="#59634F" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M36 47C41 53 43 64 41 76C40 81 42 85 44 88" stroke="#6F8064" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="7.5" cy="59" rx="2.6" ry="1.8" transform="rotate(-25 7.5 59)" fill="#899581" />
        <ellipse cx="9.2" cy="70" rx="2.7" ry="1.9" transform="rotate(15 9.2 70)" fill="#6F8064" />
        <ellipse cx="7.5" cy="82" rx="2.5" ry="1.7" transform="rotate(-20 7.5 82)" fill="#9AA891" />
        <ellipse cx="42" cy="61" rx="2.5" ry="1.8" transform="rotate(20 42 61)" fill="#899581" />
        <ellipse cx="41.5" cy="74" rx="2.6" ry="1.8" transform="rotate(-15 41.5 74)" fill="#6F8064" />
        <ellipse cx="43.5" cy="84" rx="2.3" ry="1.6" transform="rotate(20 43.5 84)" fill="#9AA891" />
      </svg>
    </div>
  );
}

export function VintageCandle() {
  return (
    <div className="shelf-prop-item decor-candle-wrap" aria-hidden="true" title="Flickering Candle">
      <div className="candle-aura" />
      <div className="candle-shelf-glow" />
      <svg width="38" height="78" viewBox="0 0 38 78" fill="none">
        <defs>
          <linearGradient id="waxGrad" x1="11" y1="24" x2="25" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FAF2DF" />
            <stop offset="60%" stopColor="#EAE0C8" />
            <stop offset="100%" stopColor="#CFC1A3" />
          </linearGradient>
          <linearGradient id="candleBrass" x1="6" y1="64" x2="30" y2="74" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECCD79" />
            <stop offset="55%" stopColor="#B88B36" />
            <stop offset="100%" stopColor="#7C591A" />
          </linearGradient>
        </defs>
        {/* Contact shadow */}
        <ellipse cx="18" cy="75.5" rx="12" ry="2.2" fill="rgba(18, 12, 8, 0.45)" />
        {/* Flame */}
        <g className="candle-flame-group">
          <path
            className="candle-flame"
            d="M18 4C18 4 23.5 11.5 23.5 16C23.5 19 21 21 18 21C15 21 12.5 19 12.5 16C12.5 11.5 18 4 18 4Z"
            fill="#F6B94E"
          />
          <path
            className="candle-flame"
            d="M18 9C18 9 20.6 13.2 20.6 15.8C20.6 17.4 19.4 18.6 18 18.6C16.6 18.6 15.4 17.4 15.4 15.8C15.4 13.2 18 9 18 9Z"
            fill="#FFF7D1"
          />
        </g>
        {/* Wick */}
        <rect x="17.3" y="20" width="1.4" height="4" fill="#3C2C22" />
        {/* Wax Pillar */}
        <rect x="11" y="24" width="14" height="40" rx="2" fill="url(#waxGrad)" stroke="#C8B99B" strokeWidth="0.8" />
        <ellipse cx="18" cy="24.5" rx="6.5" ry="1.4" fill="#FFF7E4" />
        {/* Wax drips */}
        <path d="M13 24.5C14 29 16 29 17 24.5" fill="#DFD1B4" />
        <path d="M21 24.5C21.8 31 23.2 31 24 24.5" fill="#DFD1B4" />
        {/* Brass Holder */}
        <rect x="6" y="64" width="24" height="4" rx="1.5" fill="url(#candleBrass)" stroke="#6A4A12" strokeWidth="0.6" />
        <rect x="9" y="68" width="18" height="4.5" rx="1.5" fill="#8C6722" stroke="#5E4110" strokeWidth="0.6" />
        <path d="M29 66C32.5 66 33.5 69.5 30 71.5" stroke="#C49A45" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SteamingTeacup() {
  return (
    <div className="shelf-prop-item decor-teacup" aria-hidden="true" title="Steaming Teacup">
      <svg width="48" height="54" viewBox="0 0 48 54" fill="none">
        <defs>
          <linearGradient id="cupGrad" x1="10" y1="24" x2="34" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FAF6EE" />
            <stop offset="55%" stopColor="#E9E0CE" />
            <stop offset="100%" stopColor="#C8BCA8" />
          </linearGradient>
        </defs>
        {/* Contact shadow */}
        <ellipse cx="22.5" cy="51.2" rx="16" ry="2.4" fill="rgba(18, 12, 8, 0.42)" />
        {/* Steam wisps */}
        <path className="steam-wisp wisp-1" d="M18 19C16 15 20 11 18 7" stroke="rgba(235, 226, 214, 0.78)" strokeWidth="1.5" strokeLinecap="round" />
        <path className="steam-wisp wisp-2" d="M25 18C23 14 27 10 25 5" stroke="rgba(235, 226, 214, 0.78)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Handle */}
        <path d="M33 27C38.5 27 39.5 35.5 33 36.5" stroke="#DFD5C3" strokeWidth="2.6" strokeLinecap="round" />
        {/* Cup body */}
        <path d="M11 24H34L31 43.5C30.5 45.5 28 46.5 22.5 46.5C17 46.5 14.5 45.5 14 43.5L11 24Z" fill="url(#cupGrad)" stroke="#AFA18D" strokeWidth="0.9" />
        <ellipse cx="22.5" cy="24" rx="11.5" ry="2.6" fill="#7A4F38" stroke="#AFA18D" strokeWidth="0.8" />
        <path d="M16 24.5C18 23.5 23 23.5 26 24.2" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" strokeLinecap="round" />
        {/* Saucer */}
        <ellipse cx="22.5" cy="48.5" rx="16.5" ry="3" fill="#DFD5C3" stroke="#AFA18D" strokeWidth="0.9" />
      </svg>
    </div>
  );
}

export function MiniHourglass() {
  return (
    <div className="shelf-prop-item decor-hourglass" aria-hidden="true" title="Mini Hourglass">
      <svg width="36" height="64" viewBox="0 0 36 64" fill="none">
        <defs>
          <linearGradient id="hgBrass" x1="4" y1="4" x2="30" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E6C875" />
            <stop offset="60%" stopColor="#B88B36" />
            <stop offset="100%" stopColor="#7C591A" />
          </linearGradient>
        </defs>
        <ellipse cx="18" cy="61" rx="13" ry="2.2" fill="rgba(18, 12, 8, 0.42)" />
        <rect x="5" y="4" width="26" height="4.5" rx="1.5" fill="url(#hgBrass)" stroke="#6A4A12" strokeWidth="0.6" />
        <rect x="5" y="54.5" width="26" height="4.5" rx="1.5" fill="url(#hgBrass)" stroke="#6A4A12" strokeWidth="0.6" />
        <line x1="8" y1="8.5" x2="8" y2="54.5" stroke="#9E772A" strokeWidth="1.6" />
        <line x1="28" y1="8.5" x2="28" y2="54.5" stroke="#9E772A" strokeWidth="1.6" />
        <path d="M11 8.5H25C25 20.5 20 27.5 18 31.5C16 27.5 11 20.5 11 8.5Z" fill="rgba(255,255,255,0.2)" stroke="#CFC6B8" strokeWidth="1" />
        <path d="M11 54.5H25C25 42.5 20 35.5 18 31.5C16 35.5 11 42.5 11 54.5Z" fill="rgba(255,255,255,0.2)" stroke="#CFC6B8" strokeWidth="1" />
        {/* Sand */}
        <path d="M14 20.5H22C21 25.5 19 28.5 18 30.5C17 28.5 15 25.5 14 20.5Z" fill="#DFC38C" />
        <path d="M12 54.5H24C23 48.5 20 46.5 18 46.5C16 46.5 13 48.5 12 54.5Z" fill="#DFC38C" />
        <line x1="18" y1="31.5" x2="18" y2="46.5" stroke="#DFC38C" strokeWidth="1" strokeDasharray="2 1.5" />
        {/* Glass reflection */}
        <path d="M13 12C13 17 15 22 16.5 26" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function VintageClock() {
  return (
    <div className="shelf-prop-item decor-clock" aria-hidden="true" title="Vintage Alarm Clock">
      <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
        <ellipse cx="24" cy="53" rx="15" ry="2.2" fill="rgba(18, 12, 8, 0.44)" />
        {/* Twin Bells */}
        <path d="M9 15C9 9 16 7 19 11L12 18Z" fill="#D4AA4E" stroke="#7C591A" strokeWidth="0.8" />
        <path d="M39 15C39 9 32 7 29 11L36 18Z" fill="#D4AA4E" stroke="#7C591A" strokeWidth="0.8" />
        <rect x="22" y="6" width="4" height="5" rx="1" fill="#8C6722" />
        {/* Feet */}
        <line x1="15" y1="46" x2="12" y2="52" stroke="#7C591A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="46" x2="36" y2="52" stroke="#7C591A" strokeWidth="2.5" strokeLinecap="round" />
        {/* Body & Dial */}
        <circle cx="24" cy="30" r="17" fill="#45372F" stroke="#C49A45" strokeWidth="2.5" />
        <circle cx="24" cy="30" r="13.5" fill="#FAF4E6" />
        <circle cx="24" cy="30" r="11.8" stroke="rgba(69,55,47,0.18)" strokeWidth="0.7" strokeDasharray="1 3.1" />
        <line x1="24" y1="30" x2="24" y2="21" stroke="#302D29" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="24" y1="30" x2="30" y2="33" stroke="#713D46" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="24" cy="30" r="1.7" fill="#C49A45" />
      </svg>
    </div>
  );
}

export function FramedMiniQuote() {
  return (
    <div className="shelf-prop-item decor-framed-quote" aria-hidden="true" title="Framed Mini Quote">
      <div className="mini-quote-frame">
        <span className="mini-quote-text">“A room without books is like a body without a soul.”</span>
      </div>
    </div>
  );
}

export function renderShelfProp(propId) {
  switch (propId) {
    case 'bookend':
      return <BrassBookend />;
    case 'plant':
      return <PottedPlant />;
    case 'candle':
      return <VintageCandle />;
    case 'teacup':
      return <SteamingTeacup />;
    case 'hourglass':
      return <MiniHourglass />;
    case 'clock':
      return <VintageClock />;
    case 'quote':
      return <FramedMiniQuote />;
    default:
      return null;
  }
}
