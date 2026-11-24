import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { PartId } from '../../config/parts';
import { PART_BY_ID } from '../../config/parts';
import * as G from './geometry';

/* ──────────────────────────────────────────────────────────────
   Layer system
   Each layer is a flat vector drawing placed in CSS 3D space.
   `offset` is the world-space direction it travels when exploded.
   ────────────────────────────────────────────────────────────── */

type Vec3 = [number, number, number];

interface Layer {
  key: string;
  part: PartId | null;
  w: number;
  h: number;
  place: string;
  offset?: Vec3;
  backface?: 'visible' | 'hidden';
  hotspot?: { x: number; y: number };
  content: ReactNode;
}

const Z = G.HALF_WIDTH;
const side = (z = Z) => `translate3d(0px,0px,${z}px)`;
const FRONT = `translate3d(66px,0px,${-Z}px) rotateY(-90deg)`;
const REAR = `translate3d(1138px,0px,${Z}px) rotateY(90deg)`;

const PART_DELAY: Record<PartId, number> = {
  wheels: 0,
  frontBumper: 0.02,
  rearBumper: 0.03,
  frontDoor: 0.04,
  grille: 0.05,
  rearDoor: 0.06,
  hood: 0.08,
  headlights: 0.1,
  mirror: 0.1,
  tailgate: 0.11,
  roof: 0.13,
  rearLights: 0.15,
};

const CAVITY = { fill: '#06080c', stroke: '#1a212c', strokeWidth: 1 } as const;

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  const spokes = [0, 72, 144, 216, 288];
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r="74" fill="#0b0c0f" />
      <circle r="70" fill="none" stroke="#1e2128" strokeWidth="3" />
      <circle r="64" fill="none" stroke="#14161b" strokeWidth="6" />
      <circle r="53" fill="#0e1014" />
      <circle r="40" fill="url(#disc)" />
      <circle r="40" fill="none" stroke="#2e3238" strokeWidth="1" strokeDasharray="2 4" />
      <path d="M-28,-30 A41,41 0 0 1 10,-40 L8,-30 A31,31 0 0 0 -20,-22 Z" fill="#20242b" />
      {spokes.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M-6,-12 L-12,-50 L12,-50 L6,-12 Z" fill="url(#rim)" />
          <path d="M0,-13 L0,-49" stroke="#5b636e" strokeWidth="1" />
        </g>
      ))}
      <circle r="52" fill="none" stroke="url(#rim)" strokeWidth="4" />
      <circle r="13" fill="url(#rim)" />
      <circle r="6" fill="#1a1d22" />
    </g>
  );
}

function SideSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${G.SCENE_W} ${G.SCENE_H}`} width={G.SCENE_W} height={G.SCENE_H} aria-hidden="true">
      {children}
    </svg>
  );
}

function PlaneSvg({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      {children}
    </svg>
  );
}

const SW = G.SCENE_W;
const SH = G.SCENE_H;

const LAYERS: Layer[] = [
  /* ── Ground shadow ── */
  {
    key: 'shadow',
    part: null,
    w: 1300,
    h: 640,
    place: `translate3d(-50px,382px,-320px) rotateX(90deg)`,
    content: (
      <PlaneSvg w={1300} h={640}>
        <ellipse cx="650" cy="320" rx="620" ry="290" fill="url(#groundShadow)" />
      </PlaneSvg>
    ),
  },

  /* ── Far side (dark silhouette) ── */
  {
    key: 'far',
    part: null,
    w: SW,
    h: SH,
    place: side(-Z),
    content: (
      <SideSvg>
        <path d={G.ARCH_F} fill="#030405" />
        <path d={G.ARCH_R} fill="#030405" />
        <path d={G.OUTLINE} fill="url(#paintFar)" />
        <path d={G.GREENHOUSE} fill="#05070a" />
      </SideSvg>
    ),
  },
  ...[G.WHEEL_F, G.WHEEL_R].flatMap((w, i) => [
    {
      key: `farWheel${i}`,
      part: 'wheels' as PartId,
      w: SW,
      h: SH,
      place: side(-Z - 4),
      offset: [i ? 40 : -40, 50, -170] as Vec3,
      content: (
        <SideSvg>
          <Wheel cx={w.x} cy={w.y} />
        </SideSvg>
      ),
    },
    {
      key: `farTyre${i}`,
      part: 'wheels' as PartId,
      w: SW,
      h: SH,
      place: side(-Z + 40),
      offset: [i ? 40 : -40, 50, -170] as Vec3,
      content: (
        <SideSvg>
          <circle cx={w.x} cy={w.y} r="74" fill="#08090b" />
        </SideSvg>
      ),
    },
  ]),

  /* ── Top surfaces & glass planes ── */
  {
    key: 'windscreen',
    part: null,
    w: 430,
    h: 201,
    place: `translate3d(530px,68px,${-Z}px) rotateZ(51.9deg) rotateY(-90deg)`,
    backface: 'hidden',
    content: (
      <PlaneSvg w={430} h={201}>
        <path d="M44,0 L386,0 L428,201 L2,201 Z" fill="#0b1a3a" />
        <path d="M56,6 L374,6 L414,190 L16,190 Z" fill="url(#glass)" />
        <path d="M120,188 L220,170 M250,188 L350,170" stroke="#0a0b0d" strokeWidth="4" strokeLinecap="round" />
      </PlaneSvg>
    ),
  },
  {
    key: 'roofTop',
    part: 'roof',
    w: 520,
    h: 380,
    place: `translate3d(536px,58px,-190px) rotateX(90deg)`,
    backface: 'hidden',
    offset: [0, -210, 0],
    content: (
      <PlaneSvg w={520} h={380}>
        <rect x="0" y="0" width="520" height="380" rx="40" fill="url(#paintTop)" />
        <rect x="30" y="18" width="470" height="10" rx="5" fill="#15181d" />
        <rect x="30" y="352" width="470" height="10" rx="5" fill="#15181d" />
        <rect x="60" y="70" width="400" height="240" rx="30" fill="#fff" opacity="0.05" />
      </PlaneSvg>
    ),
  },
  {
    key: 'hoodTop',
    part: 'hood',
    w: 302,
    h: 400,
    place: `translate3d(72px,228px,-200px) rotateZ(-6.84deg) rotateX(90deg)`,
    backface: 'hidden',
    offset: [-40, -170, 0],
    content: (
      <PlaneSvg w={302} h={400}>
        <path d="M0,20 C0,6 8,0 22,0 L302,22 L302,378 L22,400 C8,400 0,394 0,380 Z" fill="url(#paintTop)" />
        <path d="M20,120 C120,128 220,132 300,134 M20,280 C120,272 220,268 300,266" stroke="#9fbfff" strokeOpacity="0.28" strokeWidth="2" fill="none" />
      </PlaneSvg>
    ),
  },
  {
    key: 'rearGlass',
    part: 'tailgate',
    w: 430,
    h: 104,
    place: `translate3d(1068px,72px,${Z}px) rotateZ(-22.6deg) rotateY(90deg)`,
    backface: 'hidden',
    offset: [210, -130, 0],
    content: (
      <PlaneSvg w={430} h={104}>
        <path d="M34,0 L396,0 L412,104 L18,104 Z" fill="url(#paintFace)" />
        <path d="M54,10 L376,10 L390,94 L40,94 Z" fill="url(#glass)" />
        <rect x="175" y="2" width="80" height="5" rx="2" fill="#d1202b" />
        <path d="M215,90 L130,40" stroke="#0a0b0d" strokeWidth="3" strokeLinecap="round" />
      </PlaneSvg>
    ),
  },

  /* ── Near side body shell (stays in place) ── */
  {
    key: 'shell',
    part: null,
    w: SW,
    h: SH,
    place: side(Z),
    content: (
      <SideSvg>
        <path d={G.ARCH_F} fill="#030405" />
        <path d={G.ARCH_R} fill="#030405" />
        <path d={G.OUTLINE} fill="url(#paint)" />
        <path d={G.OUTLINE} fill="url(#paintSheen)" />
        <path d={G.OUTLINE} fill="url(#bodyShade)" />
        <path d={G.GREENHOUSE} fill="url(#glass)" />
        {[
          G.HOOD,
          G.ROOF_STRIP,
          G.TAILGATE_SIDE,
          G.FRONT_BUMPER_SIDE,
          G.REAR_BUMPER_SIDE,
          G.HEADLIGHT_SIDE,
          G.REARLIGHT_SIDE,
          G.FRONT_DOOR,
          G.REAR_DOOR,
        ].map((d, i) => (
          <path key={i} d={d} {...CAVITY} />
        ))}
        {/* Interior hints visible through the door apertures */}
        <path
          d="M480,330 L482,252 C482,240 490,234 502,234 L528,236 C536,180 546,132 558,110 C564,100 576,102 576,114 L566,238 L606,242 C618,244 622,254 618,264 L606,330 Z"
          fill="#0e1219"
        />
        <path
          d="M700,330 L702,250 C702,240 710,236 720,236 L760,238 C768,190 774,150 784,128 C790,118 800,120 800,132 L792,240 L830,244 L826,330 Z"
          fill="#0e1219"
        />
        <path d="M884,78 L896,78 L898,176 L886,177 Z" fill="#05070a" />
        <path d="M200,248 C420,232 760,214 1060,190" stroke="#bcd4ff" strokeOpacity="0.32" strokeWidth="1.4" fill="none" />
        <path d="M352,342 L836,342" stroke="#000" strokeOpacity="0.5" strokeWidth="6" />
      </SideSvg>
    ),
  },

  /* ── Near side detachable parts ── */
  {
    key: 'hoodSide',
    part: 'hood',
    w: SW,
    h: SH,
    place: side(Z + 1),
    offset: [-40, -170, 0],
    hotspot: { x: 250, y: 206 },
    content: (
      <SideSvg>
        <path d={G.HOOD} fill="url(#paint)" />
        <path d="M92,227 L372,193" stroke="#cfe0ff" strokeOpacity="0.55" strokeWidth="1.2" />
      </SideSvg>
    ),
  },
  {
    key: 'roofSide',
    part: 'roof',
    w: SW,
    h: SH,
    place: side(Z + 1),
    offset: [0, -210, 0],
    hotspot: { x: 810, y: 62 },
    content: (
      <SideSvg>
        <path d={G.ROOF_STRIP} fill="url(#paint)" />
        <path d={G.ROOF_RAIL} fill="#17191e" />
        <path d="M606,49 L1016,49" stroke="#5a616b" strokeWidth="1" />
        <path d="M590,58 L1030,59" stroke="#d6e4ff" strokeOpacity="0.5" strokeWidth="1" />
      </SideSvg>
    ),
  },
  {
    key: 'tailgateSide',
    part: 'tailgate',
    w: SW,
    h: SH,
    place: side(Z + 1),
    offset: [210, -130, 0],
    hotspot: { x: 1104, y: 196 },
    content: (
      <SideSvg>
        <path d={G.TAILGATE_SIDE} fill="url(#paint)" />
        <path d="M1056,84 L1068,72 L1076,78 L1066,90 Z" fill="#0c0e12" />
      </SideSvg>
    ),
  },
  {
    key: 'tailgateFace',
    part: 'tailgate',
    w: 430,
    h: SH,
    place: REAR,
    backface: 'hidden',
    offset: [210, -130, 0],
    content: (
      <PlaneSvg w={430} h={SH}>
        <path d="M22,168 L408,168 L412,262 L18,262 Z" fill="url(#paintFace)" />
        <rect x="160" y="222" width="110" height="26" rx="3" fill="#e9ecef" />
        <rect x="160" y="222" width="12" height="26" rx="2" fill="#1d4ed8" />
        <rect x="150" y="204" width="130" height="8" rx="4" fill="url(#chrome)" />
        <ellipse cx="215" cy="190" rx="16" ry="7" fill="url(#chrome)" />
      </PlaneSvg>
    ),
  },
  {
    key: 'frontBumperSide',
    part: 'frontBumper',
    w: SW,
    h: SH,
    place: side(Z + 2),
    offset: [-150, 30, 40],
    hotspot: { x: 118, y: 300 },
    content: (
      <SideSvg>
        <path d={G.FRONT_BUMPER_SIDE} fill="url(#paint)" />
        <path d={G.FRONT_BUMPER_SIDE} fill="url(#bodyShade)" />
        <path d="M70,314 L150,318 C156,320 156,328 150,330 L76,328 Z" fill="#06080b" />
        <ellipse cx="84" cy="298" rx="6" ry="9" fill="#2b3038" />
      </SideSvg>
    ),
  },
  {
    key: 'frontFascia',
    part: 'frontBumper',
    w: 430,
    h: SH,
    place: FRONT,
    backface: 'hidden',
    offset: [-150, 30, 40],
    content: (
      <PlaneSvg w={430} h={SH}>
        <path
          d="M18,232 C20,225 30,221 46,221 L384,221 C400,221 410,225 412,232 L420,300 C422,330 416,344 404,346 L26,346 C14,344 8,330 10,300 Z"
          fill="url(#paintFace)"
        />
        <path d="M46,221 L384,221" stroke="#d6e4ff" strokeOpacity="0.45" strokeWidth="2" />
        {/* cavities for grille & lamps */}
        <path d="M140,236 L290,236 C296,236 298,240 296,246 L286,262 L144,262 L134,246 C132,240 134,236 140,236 Z" {...CAVITY} />
        <path d="M110,276 L320,276 C330,276 334,282 332,290 L318,330 C316,336 310,338 304,338 L126,338 C120,338 114,336 112,330 L98,290 C96,282 100,276 110,276 Z" {...CAVITY} />
        <path d="M30,236 C36,228 50,226 70,226 L134,236 L130,256 C110,262 60,262 40,256 C30,252 26,244 30,236 Z" {...CAVITY} />
        <path d="M400,236 C394,228 380,226 360,226 L296,236 L300,256 C320,262 370,262 390,256 C400,252 404,244 400,236 Z" {...CAVITY} />
        <circle cx="56" cy="312" r="11" fill="#0a0c10" stroke="#3b424d" />
        <circle cx="374" cy="312" r="11" fill="#0a0c10" stroke="#3b424d" />
        <path d="M30,342 L400,342" stroke="#000" strokeOpacity="0.6" strokeWidth="6" />
      </PlaneSvg>
    ),
  },
  {
    key: 'grilleFace',
    part: 'grille',
    w: 430,
    h: SH,
    place: FRONT,
    backface: 'hidden',
    offset: [-270, -10, 0],
    hotspot: { x: 215, y: 306 },
    content: (
      <PlaneSvg w={430} h={SH}>
        <path d="M140,236 L290,236 C296,236 298,240 296,246 L286,262 L144,262 L134,246 C132,240 134,236 140,236 Z" fill="#07090c" stroke="url(#chrome)" strokeWidth="2" />
        <path d="M142,244 L288,244 M146,252 L284,252" stroke="url(#chrome)" strokeWidth="2.2" />
        <ellipse cx="215" cy="249" rx="17" ry="7.5" fill="#12275a" stroke="url(#chrome)" strokeWidth="2" />
        <path d="M110,276 L320,276 C330,276 334,282 332,290 L318,330 C316,336 310,338 304,338 L126,338 C120,338 114,336 112,330 L98,290 C96,282 100,276 110,276 Z" fill="url(#mesh)" stroke="#2c323b" strokeWidth="2" />
        <path d="M102,296 L328,296" stroke="url(#chrome)" strokeWidth="2.5" />
      </PlaneSvg>
    ),
  },
  {
    key: 'headlightSide',
    part: 'headlights',
    w: SW,
    h: SH,
    place: side(Z + 2),
    offset: [-210, -90, 30],
    hotspot: { x: 150, y: 242 },
    content: (
      <SideSvg>
        <path d={G.HEADLIGHT_SIDE} fill="url(#headlamp)" stroke="#d9e2ee" strokeOpacity="0.6" />
        <path d="M84,248 C100,242 160,236 224,228" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.6" fill="none" />
        <circle cx="104" cy="248" r="8" fill="#1b222c" stroke="#e8eef7" strokeWidth="1.5" />
      </SideSvg>
    ),
  },
  {
    key: 'headlightFace',
    part: 'headlights',
    w: 430,
    h: SH,
    place: FRONT,
    backface: 'hidden',
    offset: [-210, -90, 30],
    content: (
      <PlaneSvg w={430} h={SH}>
        {[false, true].map((mirror) => (
          <g key={String(mirror)} transform={mirror ? 'translate(430 0) scale(-1 1)' : undefined}>
            <path d="M30,236 C36,228 50,226 70,226 L134,236 L130,256 C110,262 60,262 40,256 C30,252 26,244 30,236 Z" fill="url(#headlamp)" stroke="#e8eef7" strokeOpacity="0.7" />
            <circle cx="62" cy="244" r="10" fill="#151b24" stroke="#eef3fa" strokeWidth="1.6" />
            <circle cx="98" cy="245" r="7" fill="#1b222c" stroke="#d2dbe7" strokeWidth="1.2" />
            <path d="M38,254 C70,258 110,256 128,250" stroke="#fff" strokeWidth="1.6" fill="none" />
          </g>
        ))}
      </PlaneSvg>
    ),
  },
  {
    key: 'rearLightSide',
    part: 'rearLights',
    w: SW,
    h: SH,
    place: side(Z + 2),
    offset: [270, -40, 40],
    hotspot: { x: 1086, y: 206 },
    content: (
      <SideSvg>
        <path d={G.REARLIGHT_SIDE} fill="url(#taillamp)" stroke="#ff8a80" strokeOpacity="0.4" />
        <path d="M1060,140 L1098,206 M1072,150 L1110,222" stroke="#ffb3ab" strokeOpacity="0.45" strokeWidth="1.2" />
      </SideSvg>
    ),
  },
  {
    key: 'rearLightFace',
    part: 'rearLights',
    w: 430,
    h: SH,
    place: REAR,
    backface: 'hidden',
    offset: [270, -40, 40],
    content: (
      <PlaneSvg w={430} h={SH}>
        {[false, true].map((mirror) => (
          <g key={String(mirror)} transform={mirror ? 'translate(430 0) scale(-1 1)' : undefined}>
            <path d="M6,150 L40,160 L44,262 L16,262 C8,236 4,190 6,150 Z" fill="url(#taillamp)" stroke="#ff8a80" strokeOpacity="0.4" />
            <path d="M14,180 L40,184 M14,206 L42,208 M16,232 L43,233" stroke="#ffb3ab" strokeOpacity="0.5" />
          </g>
        ))}
      </PlaneSvg>
    ),
  },
  {
    key: 'rearBumperSide',
    part: 'rearBumper',
    w: SW,
    h: SH,
    place: side(Z + 2),
    offset: [210, 60, 30],
    hotspot: { x: 1070, y: 304 },
    content: (
      <SideSvg>
        <path d={G.REAR_BUMPER_SIDE} fill="url(#paint)" />
        <path d={G.REAR_BUMPER_SIDE} fill="url(#bodyShade)" />
        <path d="M1110,300 L1138,298 L1138,306 L1112,308 Z" fill="#7a1015" />
      </SideSvg>
    ),
  },
  {
    key: 'rearBumperFace',
    part: 'rearBumper',
    w: 430,
    h: SH,
    place: REAR,
    backface: 'hidden',
    offset: [210, 60, 30],
    content: (
      <PlaneSvg w={430} h={SH}>
        <path d="M14,264 L416,264 C420,300 418,334 406,346 L24,346 C12,334 10,300 14,264 Z" fill="url(#paintFace)" />
        <path d="M14,265 L416,265" stroke="#d6e4ff" strokeOpacity="0.4" strokeWidth="2" />
        <path d="M60,322 L370,322 L360,344 L70,344 Z" fill="#090b0f" />
        <rect x="40" y="298" width="34" height="7" rx="3" fill="#7a1015" />
        <rect x="356" y="298" width="34" height="7" rx="3" fill="#7a1015" />
      </PlaneSvg>
    ),
  },
  {
    key: 'rearDoor',
    part: 'rearDoor',
    w: SW,
    h: SH,
    place: side(Z + 2),
    offset: [40, 30, 230],
    hotspot: { x: 760, y: 272 },
    content: (
      <SideSvg>
        <path d={G.REAR_DOOR} fill="url(#paint)" stroke="#06080c" strokeWidth="1.5" />
        <path d={G.REAR_DOOR} fill="url(#paintSheen)" />
        <path d={G.REAR_DOOR} fill="url(#bodyShade)" />
        <path d={G.REAR_DOOR_FRAME} fill="#0a0c10" />
        <path d={G.REAR_DOOR_GLASS} fill="url(#glass)" />
        <path d="M658,186 L886,177" stroke="url(#chrome)" strokeWidth="1.6" />
        <path d="M660,229 C760,222 820,218 882,214" stroke="#bcd4ff" strokeOpacity="0.3" strokeWidth="1.2" fill="none" />
        <rect x="806" y="232" width="36" height="8" rx="4" fill="url(#chrome)" />
      </SideSvg>
    ),
  },
  {
    key: 'frontDoor',
    part: 'frontDoor',
    w: SW,
    h: SH,
    place: side(Z + 3),
    offset: [-30, 30, 230],
    hotspot: { x: 520, y: 272 },
    content: (
      <SideSvg>
        <path d={G.FRONT_DOOR} fill="url(#paint)" stroke="#06080c" strokeWidth="1.5" />
        <path d={G.FRONT_DOOR} fill="url(#paintSheen)" />
        <path d={G.FRONT_DOOR} fill="url(#bodyShade)" />
        <path d={G.FRONT_DOOR_FRAME} fill="#0a0c10" />
        <path d={G.FRONT_DOOR_GLASS} fill="url(#glass)" />
        <path d="M402,197 L648,187" stroke="url(#chrome)" strokeWidth="1.6" />
        <path d="M400,240 C500,234 580,231 650,229" stroke="#bcd4ff" strokeOpacity="0.3" strokeWidth="1.2" fill="none" />
        <rect x="590" y="236" width="36" height="8" rx="4" fill="url(#chrome)" />
      </SideSvg>
    ),
  },
  {
    key: 'mirror',
    part: 'mirror',
    w: SW,
    h: SH,
    place: side(Z + 26),
    offset: [-90, -70, 330],
    hotspot: { x: 438, y: 186 },
    content: (
      <SideSvg>
        <path d={G.MIRROR_BASE} fill="#0b0d11" />
        <path d={G.MIRROR} fill="url(#paint)" stroke="#06080c" />
        <path d="M410,190 C420,196 446,198 466,194" stroke="#f0a020" strokeWidth="2" fill="none" opacity="0.85" />
      </SideSvg>
    ),
  },
  ...[G.WHEEL_F, G.WHEEL_R].flatMap((w, i) => [
    {
      key: `tyreInner${i}`,
      part: 'wheels' as PartId,
      w: SW,
      h: SH,
      place: side(Z - 40),
      offset: [i ? 40 : -40, 50, 190] as Vec3,
      content: (
        <SideSvg>
          <circle cx={w.x} cy={w.y} r="74" fill="#08090b" />
        </SideSvg>
      ),
    },
    {
      key: `wheel${i}`,
      part: 'wheels' as PartId,
      w: SW,
      h: SH,
      place: side(Z + 4),
      offset: [i ? 40 : -40, 50, 190] as Vec3,
      hotspot: i === 0 ? { x: w.x, y: w.y } : undefined,
      content: (
        <SideSvg>
          <Wheel cx={w.x} cy={w.y} />
        </SideSvg>
      ),
    },
  ]),
];

/* ──────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────── */

export interface CarPose {
  explode: number; // 0 = assembled, 1 = fully exploded
  ry: number; // scene rotation (deg) around vertical axis
  rx: number; // scene tilt (deg)
}

export interface CarHandle {
  setPose: (pose: Partial<CarPose>) => void;
}

interface Props {
  /** Scene width (in model units) that should fit the container width. */
  fit?: number;
  /** Aspect ratio of the stage box (width / height). */
  aspect?: number;
  initialPose?: Partial<CarPose>;
  selected?: PartId | null;
  onSelect?: (id: PartId) => void;
  showHotspots?: boolean;
  className?: string;
  style?: CSSProperties;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const CarModel = forwardRef<CarHandle, Props>(function CarModel(
  { fit = 1400, aspect = 2.2, initialPose, selected = null, onSelect, showHotspots = false, className, style },
  ref,
) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const layerEls = useRef<(HTMLDivElement | null)[]>([]);
  const pose = useRef<CarPose>({ explode: 0, ry: 28, rx: -8, ...initialPose });
  const [scale, setScale] = useState(0.5);

  const render = () => {
    const { explode, ry, rx } = pose.current;
    if (sceneRef.current) sceneRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    LAYERS.forEach((layer, i) => {
      const el = layerEls.current[i];
      if (!el) return;
      let t = 0;
      if (layer.offset && layer.part) {
        const d = PART_DELAY[layer.part];
        t = ease(clamp((explode - d) / (1 - 0.15)));
      }
      const [dx, dy, dz] = layer.offset ?? [0, 0, 0];
      el.style.transform = t
        ? `translate3d(${dx * t}px,${dy * t}px,${dz * t}px) ${layer.place}`
        : layer.place;
    });
    if (stageRef.current) stageRef.current.dataset.exploded = explode > 0.72 ? 'true' : 'false';
  };

  useImperativeHandle(ref, () => ({
    setPose: (p) => {
      pose.current = { ...pose.current, ...p };
      render();
    },
  }));

  useLayoutEffect(render, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / fit));
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <div
      ref={stageRef}
      className={`car-stage ${showHotspots ? 'with-hotspots' : ''} ${selected ? 'has-selection' : ''} ${className ?? ''}`}
      style={{ aspectRatio: String(aspect), ...style }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: G.SCENE_W,
          height: G.SCENE_H,
          transform: `translate(-50%,-46%) scale(${scale})`,
          perspective: '2600px',
          perspectiveOrigin: '50% 40%',
        }}
      >
        <div
          ref={sceneRef}
          className="car-scene"
          style={{ width: G.SCENE_W, height: G.SCENE_H, transformOrigin: '600px 230px' }}
        >
          {LAYERS.map((layer, i) => {
            const info = layer.part ? PART_BY_ID[layer.part] : null;
            const isSel = selected && layer.part === selected;
            return (
              <div
                key={layer.key}
                ref={(el) => (layerEls.current[i] = el)}
                className={`car-layer ${layer.part ? 'is-part' : ''} ${isSel ? 'is-selected' : ''}`}
                data-part={layer.part ?? undefined}
                style={{
                  width: layer.w,
                  height: layer.h,
                  backfaceVisibility: layer.backface ?? 'visible',
                }}
              >
                {layer.content}
                {layer.hotspot && info && onSelect && (
                  <button
                    type="button"
                    className={`hotspot ${isSel ? 'is-active' : ''}`}
                    style={{ left: layer.hotspot.x, top: layer.hotspot.y }}
                    onClick={() => onSelect(info.id)}
                    onMouseEnter={() => onSelect(info.id)}
                    onFocus={() => onSelect(info.id)}
                    aria-label={`${info.name}: show details`}
                    tabIndex={showHotspots ? 0 : -1}
                  >
                    <span className="hotspot-ring" />
                    <span className="hotspot-label">{info.name}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
