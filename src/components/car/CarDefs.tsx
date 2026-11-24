/** Shared SVG gradients/patterns. Rendered once at the app root. */
export function CarDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        {/* Deep metallic blue — side panels */}
        <linearGradient id="paint" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="0" y2="350">
          <stop offset="0" stopColor="#4b7dd1" />
          <stop offset="0.28" stopColor="#2a58a8" />
          <stop offset="0.5" stopColor="#1c4189" />
          <stop offset="0.56" stopColor="#123068" />
          <stop offset="0.78" stopColor="#0d2452" />
          <stop offset="1" stopColor="#07132e" />
        </linearGradient>
        <linearGradient id="paintSheen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#bcd4ff" stopOpacity="0.16" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.72" stopColor="#bcd4ff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paintFace" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="350">
          <stop offset="0" stopColor="#2d5bab" />
          <stop offset="0.45" stopColor="#173b7d" />
          <stop offset="1" stopColor="#081631" />
        </linearGradient>
        <linearGradient id="paintTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3c6cc0" />
          <stop offset="0.45" stopColor="#5d8ad9" />
          <stop offset="0.55" stopColor="#2c58a6" />
          <stop offset="1" stopColor="#173b7c" />
        </linearGradient>
        <linearGradient id="paintFar" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="0" y2="350">
          <stop offset="0" stopColor="#14295a" />
          <stop offset="1" stopColor="#050b1a" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a4658" />
          <stop offset="0.3" stopColor="#10151d" />
          <stop offset="0.55" stopColor="#1d2532" />
          <stop offset="0.62" stopColor="#0a0d12" />
          <stop offset="1" stopColor="#05070a" />
        </linearGradient>
        <linearGradient id="bodyShade" gradientUnits="userSpaceOnUse" x1="0" y1="250" x2="0" y2="350">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="rim" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f1f4f8" />
          <stop offset="0.5" stopColor="#aab2bd" />
          <stop offset="1" stopColor="#59616c" />
        </radialGradient>
        <radialGradient id="disc" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2d33" />
          <stop offset="0.7" stopColor="#5a5f67" />
          <stop offset="1" stopColor="#3a3e44" />
        </radialGradient>
        <linearGradient id="headlamp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f8ff" />
          <stop offset="0.35" stopColor="#9fb0c6" />
          <stop offset="0.7" stopColor="#3b4656" />
          <stop offset="1" stopColor="#c7d3e4" />
        </linearGradient>
        <linearGradient id="taillamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5a4f" />
          <stop offset="0.45" stopColor="#b3121a" />
          <stop offset="1" stopColor="#5c0408" />
        </linearGradient>
        <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6f9" />
          <stop offset="0.5" stopColor="#8d95a1" />
          <stop offset="1" stopColor="#dfe4ea" />
        </linearGradient>
        <pattern id="mesh" width="10" height="8" patternUnits="userSpaceOnUse">
          <rect width="10" height="8" fill="#05070a" />
          <path d="M0,4 L5,0 L10,4 L5,8 Z" fill="none" stroke="#2b313a" strokeWidth="1.2" />
        </pattern>
        <radialGradient id="groundShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
