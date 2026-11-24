import type { ReactNode } from 'react';
import type { InteriorArtKey } from '../../config/interior';

/**
 * Technical line illustrations used until real interior photographs are supplied.
 * viewBox 1000 × 625 (16:10).
 */

const S = { stroke: '#8fb4ff', strokeOpacity: 0.75, strokeWidth: 2, fill: 'none' } as const;
const SOFT = { stroke: '#8fb4ff', strokeOpacity: 0.3, strokeWidth: 1.2, fill: 'none' } as const;
const PANEL = { fill: 'url(#ia-panel)', stroke: '#8fb4ff', strokeOpacity: 0.55, strokeWidth: 1.6 } as const;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 1000 625" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ia-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2333" />
          <stop offset="1" stopColor="#0a0e15" />
        </linearGradient>
        <linearGradient id="ia-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1420" />
          <stop offset="1" stopColor="#05070b" />
        </linearGradient>
        <radialGradient id="ia-glow" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#2b5cb4" stopOpacity="0.28" />
          <stop offset="1" stopColor="#2b5cb4" stopOpacity="0" />
        </radialGradient>
        <pattern id="ia-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25,0 L0,0 0,25" fill="none" stroke="#8fb4ff" strokeOpacity="0.06" />
        </pattern>
        <pattern id="ia-stitch" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#121925" />
          <circle cx="4" cy="4" r="0.9" fill="#8fb4ff" fillOpacity="0.18" />
        </pattern>
      </defs>
      <rect width="1000" height="625" fill="url(#ia-bg)" />
      <rect width="1000" height="625" fill="url(#ia-grid)" />
      <rect width="1000" height="625" fill="url(#ia-glow)" />
      {children}
    </svg>
  );
}

function Dial({ cx, cy, r, label }: { cx: number; cy: number; r: number; label: string }) {
  const ticks = Array.from({ length: 41 }, (_, i) => i);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#070a10" stroke="#8fb4ff" strokeOpacity="0.7" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r - 14} {...SOFT} />
      {ticks.map((i) => {
        const a = ((-225 + (i * 270) / 40) * Math.PI) / 180;
        const long = i % 5 === 0;
        const r1 = r - 20;
        const r2 = r - (long ? 40 : 30);
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2}
            y2={cy + Math.sin(a) * r2}
            stroke={i > 32 && label === 'rpm' ? '#ff5a4f' : '#cfe0ff'}
            strokeOpacity={long ? 0.9 : 0.45}
            strokeWidth={long ? 3 : 1.5}
          />
        );
      })}
      <line x1={cx} y1={cy} x2={cx - r * 0.55} y2={cy + r * 0.38} stroke="#ff6a3d" strokeWidth="4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="14" fill="#1a2333" stroke="#8fb4ff" strokeOpacity="0.6" />
      <text x={cx} y={cy + r * 0.5} textAnchor="middle" fill="#8fb4ff" fillOpacity="0.6" fontSize="16" fontFamily="Manrope" letterSpacing="4">
        {label.toUpperCase()}
      </text>
    </g>
  );
}

function Seat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-50" y="-260" width="100" height="70" rx="26" {...PANEL} />
      <path d="M-22,-190 L-22,-170 M22,-190 L22,-170" {...S} />
      <path d="M-120,-150 C-130,-40 -120,40 -110,90 L110,90 C120,40 130,-40 120,-150 C110,-176 -110,-176 -120,-150 Z" {...PANEL} />
      <path d="M-70,-140 C-76,-40 -72,30 -66,80 L66,80 C72,30 76,-40 70,-140 Z" fill="url(#ia-stitch)" stroke="#8fb4ff" strokeOpacity="0.4" />
      <path d="M-150,90 C-150,70 -130,60 -100,60 L100,60 C130,60 150,70 150,90 L160,190 C160,210 140,220 120,220 L-120,220 C-140,220 -160,210 -160,190 Z" {...PANEL} />
      <path d="M-90,90 L-96,200 L96,200 L90,90 Z" fill="url(#ia-stitch)" stroke="#8fb4ff" strokeOpacity="0.4" />
    </g>
  );
}

const ART: Record<InteriorArtKey, ReactNode> = {
  dashboard: (
    <Frame>
      <path d="M0,150 C260,96 740,96 1000,150" {...S} />
      <path d="M0,150 L0,0 M1000,150 L1000,0" {...SOFT} />
      <path d="M30,300 C260,240 740,240 970,300 L990,372 C760,330 240,330 10,372 Z" {...PANEL} />
      <path d="M10,372 C240,330 760,330 990,372 L1000,625 L0,625 Z" fill="#090d14" stroke="#8fb4ff" strokeOpacity="0.4" />
      {/* centre stack */}
      <path d="M420,328 L580,328 L604,600 L396,600 Z" {...PANEL} />
      <rect x="448" y="345" width="104" height="56" rx="6" fill="#06080c" stroke="#8fb4ff" strokeOpacity="0.7" />
      <rect x="430" y="282" width="56" height="26" rx="6" {...PANEL} />
      <rect x="514" y="282" width="56" height="26" rx="6" {...PANEL} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={450 + (i % 3) * 36} y={420 + Math.floor(i / 3) * 28} width="26" height="14" rx="3" {...SOFT} />
      ))}
      <circle cx="446" cy="510" r="18" {...S} />
      <circle cx="554" cy="510" r="18" {...S} />
      <circle cx="500" cy="510" r="12" {...SOFT} />
      {/* driver side */}
      <path d="M140,300 C180,262 330,262 370,300" {...S} />
      <circle cx="255" cy="440" r="150" fill="none" stroke="#8fb4ff" strokeOpacity="0.8" strokeWidth="16" />
      <path d="M115,450 L200,440 M395,450 L310,440 M255,520 L255,590" stroke="#8fb4ff" strokeOpacity="0.6" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="255" cy="445" rx="62" ry="52" {...PANEL} />
      <rect x="70" y="320" width="50" height="24" rx="6" {...PANEL} />
      {/* passenger side */}
      <rect x="880" y="320" width="50" height="24" rx="6" {...PANEL} />
      <path d="M690,410 C760,400 860,404 930,420 L920,500 C850,486 760,484 700,492 Z" {...PANEL} />
      <path d="M780,450 L840,452" {...S} />
      <path d="M640,290 C720,280 820,284 900,296" {...SOFT} />
    </Frame>
  ),
  steering: (
    <Frame>
      <path d="M180,140 C300,60 700,60 820,140" {...SOFT} />
      <circle cx="380" cy="150" r="70" {...SOFT} />
      <circle cx="620" cy="150" r="70" {...SOFT} />
      <circle cx="500" cy="330" r="250" fill="none" stroke="#8fb4ff" strokeOpacity="0.85" strokeWidth="38" />
      <circle cx="500" cy="330" r="232" {...SOFT} />
      <circle cx="500" cy="330" r="268" {...SOFT} />
      <path d="M262,350 C300,330 360,320 420,330 L430,380 C380,384 320,396 270,410 Z" {...PANEL} />
      <path d="M738,350 C700,330 640,320 580,330 L570,380 C620,384 680,396 730,410 Z" {...PANEL} />
      <path d="M460,420 L540,420 L560,560 L440,560 Z" {...PANEL} />
      <path d="M410,280 C410,240 440,220 500,220 C560,220 590,240 590,280 L590,380 C590,420 560,440 500,440 C440,440 410,420 410,380 Z" {...PANEL} />
      <ellipse cx="500" cy="320" rx="40" ry="18" {...S} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={300 + i * 36} y="350" width="26" height="14" rx="4" {...S} />
          <rect x={646 + i * 36} y="350" width="26" height="14" rx="4" {...S} />
        </g>
      ))}
      <path d="M500,580 L500,625" stroke="#8fb4ff" strokeOpacity="0.5" strokeWidth="40" />
    </Frame>
  ),
  cluster: (
    <Frame>
      <path d="M60,120 C260,40 740,40 940,120 L960,540 L40,540 Z" fill="#070a10" stroke="#8fb4ff" strokeOpacity="0.5" strokeWidth="2" />
      <Dial cx={300} cy={320} r={190} label="rpm" />
      <Dial cx={700} cy={320} r={190} label="km/h" />
      <rect x="430" y="235" width="140" height="170" rx="10" fill="#0b111b" stroke="#8fb4ff" strokeOpacity="0.8" strokeWidth="2" />
      <path d="M450,270 L550,270 M450,300 L530,300 M450,330 L540,330" stroke="#cfe0ff" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" />
      <rect x="450" y="360" width="100" height="10" rx="5" {...SOFT} />
      <rect x="450" y="360" width="62" height="10" rx="5" fill="#6aa7ff" fillOpacity="0.7" />
    </Frame>
  ),
  console: (
    <Frame>
      <path d="M380,0 L620,0 L720,625 L280,625 Z" {...PANEL} />
      <path d="M400,40 L600,40 L612,120 L388,120 Z" fill="#06080c" stroke="#8fb4ff" strokeOpacity="0.5" />
      <ellipse cx="500" cy="230" rx="90" ry="72" fill="url(#ia-stitch)" stroke="#8fb4ff" strokeOpacity="0.6" strokeWidth="2" />
      <ellipse cx="500" cy="225" rx="42" ry="38" fill="#1a2333" stroke="#cfe0ff" strokeOpacity="0.8" strokeWidth="2" />
      <path d="M500,200 L500,250 M480,205 L480,245 M520,205 L520,245 M480,225 L520,225" stroke="#cfe0ff" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="430" cy="380" r="34" fill="#06080c" stroke="#8fb4ff" strokeOpacity="0.7" strokeWidth="2" />
      <circle cx="430" cy="380" r="24" {...SOFT} />
      <circle cx="430" cy="455" r="34" fill="#06080c" stroke="#8fb4ff" strokeOpacity="0.7" strokeWidth="2" />
      <circle cx="430" cy="455" r="24" {...SOFT} />
      <path d="M560,330 L600,330 L610,500 L570,500 Z" {...PANEL} />
      <rect x="566" y="334" width="38" height="40" rx="8" fill="#1a2333" stroke="#8fb4ff" strokeOpacity="0.6" />
      <rect x="350" y="530" width="300" height="140" rx="40" fill="url(#ia-stitch)" stroke="#8fb4ff" strokeOpacity="0.7" strokeWidth="2" />
      <path d="M260,0 C200,200 180,400 200,625 M740,0 C800,200 820,400 800,625" {...SOFT} />
    </Frame>
  ),
  frontSeats: (
    <Frame>
      <path d="M0,560 L1000,560" {...SOFT} />
      <Seat x={280} y={330} s={1} />
      <Seat x={720} y={330} s={1} />
      <path d="M440,420 L560,420 L580,600 L420,600 Z" {...PANEL} />
      <path d="M0,120 C260,90 740,90 1000,120" {...SOFT} />
    </Frame>
  ),
  rearSeats: (
    <Frame>
      {[220, 500, 780].map((x) => (
        <rect key={x} x={x - 48} y="60" width="96" height="62" rx="22" {...PANEL} />
      ))}
      <path d="M90,150 C90,130 110,120 140,120 L860,120 C890,120 910,130 910,150 L930,380 L70,380 Z" {...PANEL} />
      <path d="M608,124 L612,378" stroke="#6aa7ff" strokeWidth="3" strokeDasharray="10 8" />
      {[140, 400, 660].map((x, i) => (
        <path key={x} d={`M${x},150 L${x + (i === 2 ? 200 : 200)},150 L${x + 206},360 L${x - 6},360 Z`} fill="url(#ia-stitch)" stroke="#8fb4ff" strokeOpacity="0.35" />
      ))}
      <path d="M50,400 C50,385 70,380 100,380 L900,380 C930,380 950,385 950,400 L970,530 C970,545 950,555 920,555 L80,555 C50,555 30,545 30,530 Z" {...PANEL} />
      {[190, 250, 750, 810].map((x) => (
        <rect key={x} x={x - 12} y="372" width="24" height="16" rx="4" fill="#06080c" stroke="#6aa7ff" strokeOpacity="0.8" />
      ))}
      <path d="M0,600 L1000,600" {...SOFT} />
    </Frame>
  ),
  boot: (
    <Frame>
      <path d="M90,40 L910,40 L960,560 L40,560 Z" fill="none" stroke="#8fb4ff" strokeOpacity="0.85" strokeWidth="4" />
      <path d="M260,140 L740,140 L760,330 L240,330 Z" {...PANEL} />
      <path d="M240,330 L760,330 L900,520 L100,520 Z" fill="#0d1420" stroke="#8fb4ff" strokeOpacity="0.6" strokeWidth="2" />
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8;
        return (
          <path
            key={i}
            d={`M${240 - 140 * t},${330 + 190 * t} L${760 + 140 * t},${330 + 190 * t}`}
            {...SOFT}
          />
        );
      })}
      <path d="M90,40 L260,140 M910,40 L740,140 M240,330 L100,520 M760,330 L900,520" {...SOFT} />
      <path d="M500,140 L500,330" stroke="#8fb4ff" strokeOpacity="0.5" strokeDasharray="8 8" />
      <path d="M100,520 L900,520 L940,570 L60,570 Z" {...PANEL} />
      <path d="M130,592 L870,592" stroke="#6aa7ff" strokeWidth="2" markerEnd="" />
      <path d="M130,584 L130,600 M870,584 L870,600" stroke="#6aa7ff" strokeWidth="2" />
      <path d="M970,330 L1000,330 M970,520 L1000,520" stroke="#6aa7ff" strokeOpacity="0.6" />
    </Frame>
  ),
};

export function InteriorArt({ name }: { name: InteriorArtKey }) {
  return <>{ART[name]}</>;
}
