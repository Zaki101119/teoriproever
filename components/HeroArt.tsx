export function HeroArt() {
  return (
    <div className="hero-scene">
      <svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A car driving on a road past a warning sign">
        <circle cx="300" cy="150" r="150" fill="#dbe9ff" />
        <g fill="#ffffff" opacity="0.9">
          <ellipse cx="360" cy="90" rx="30" ry="14" />
          <ellipse cx="388" cy="92" rx="22" ry="11" />
          <ellipse cx="180" cy="70" rx="24" ry="11" />
        </g>
        <g opacity="0.5" fill="#bcd0ee">
          <rect x="205" y="88" width="34" height="110" />
          <rect x="244" y="110" width="26" height="88" />
          <rect x="330" y="80" width="30" height="118" />
          <rect x="366" y="106" width="24" height="92" />
        </g>
        <rect x="0" y="286" width="520" height="70" fill="#3a4657" />
        <rect x="0" y="282" width="520" height="4" fill="#2c3542" />
        <g className="hero-lane" fill="#f2b705">
          <rect x="20" y="316" width="34" height="6" rx="3" />
          <rect x="90" y="316" width="34" height="6" rx="3" />
          <rect x="160" y="316" width="34" height="6" rx="3" />
          <rect x="230" y="316" width="34" height="6" rx="3" />
          <rect x="300" y="316" width="34" height="6" rx="3" />
          <rect x="370" y="316" width="34" height="6" rx="3" />
          <rect x="440" y="316" width="34" height="6" rx="3" />
          <rect x="510" y="316" width="34" height="6" rx="3" />
        </g>
        <g>
          <rect x="120" y="168" width="6" height="120" fill="#8797ab" />
          <path d="M123 138 L150 186 L96 186 Z" fill="#f2b705" stroke="#16202e" strokeWidth="4" />
          <rect x="120" y="158" width="6" height="22" fill="#16202e" />
        </g>
        <g className="hero-car">
          <ellipse cx="330" cy="290" rx="120" ry="10" fill="#16202e" opacity="0.14" />
          <path d="M235 276 Q240 238 275 234 L300 218 Q320 206 350 206 L392 206 Q408 206 418 226 L432 234 Q452 238 452 262 L452 276 Q452 282 446 282 L241 282 Q235 282 235 276 Z" fill="#2f6fed" />
          <path d="M300 218 Q320 206 350 206 L392 206 Q404 206 412 218 Z" fill="#4d86f5" />
          <path d="M308 220 L328 208 L346 208 L346 220 Z" fill="#eaf2ff" />
          <path d="M352 208 L388 208 Q398 208 404 220 L352 220 Z" fill="#eaf2ff" />
          <circle cx="446" cy="250" r="5" fill="#ffe08a" />
          <circle cx="285" cy="280" r="24" fill="#16202e" />
          <circle cx="285" cy="280" r="10" fill="#8797ab" />
          <circle cx="405" cy="280" r="24" fill="#16202e" />
          <circle cx="405" cy="280" r="10" fill="#8797ab" />
        </g>
        <g className="hero-badge">
          <circle cx="150" cy="248" r="20" fill="#1f9d57" />
          <path d="M141 248 l6 6 l12 -13" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}
