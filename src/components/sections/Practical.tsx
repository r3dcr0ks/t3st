import { useLayoutEffect, useRef, useState } from 'react';
import { Luggage, Armchair, Baby, LayoutGrid, Route, type LucideIcon } from 'lucide-react';
import { OUTLINE, ARCH_F, ARCH_R, GREENHOUSE } from '../car/geometry';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Luggage,
    title: 'Spacious luggage compartment',
    text: 'A long, square load bay swallows suitcases, a pushchair and the weekly shop — all at once.',
  },
  {
    icon: Armchair,
    title: 'Comfortable rear passenger area',
    text: 'The long wheelbase leaves genuine knee room behind tall drivers, with three proper rear places.',
  },
  {
    icon: Baby,
    title: 'Family-oriented design',
    text: 'Wide-opening rear doors and a low load lip make child seats, prams and dogs easy to handle.',
  },
  {
    icon: LayoutGrid,
    title: 'Versatile interior configuration',
    text: 'Fold the split rear backrest and the floor stretches from tailgate almost to the front seats.',
  },
  {
    icon: Route,
    title: 'Long-distance comfort',
    text: 'A settled ride, supportive seats and a quiet cabin — made for crossing countries, not just towns.',
  },
];

export function Practical() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setActive(-1);
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.6}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(FEATURES.length - 1, Math.floor(self.progress * FEATURES.length))),
        },
      });
      tl.from('[data-xs-outline]', { strokeDashoffset: 4000, duration: 1.2, ease: 'none' }, 0)
        .from('[data-xs-load]', { scaleX: 0, transformOrigin: '1110px 0px', duration: 0.8 }, 0.6)
        .from('[data-xs-bag]', { y: -60, opacity: 0, stagger: 0.25, duration: 0.5, ease: 'back.out(1.4)' }, 0.9)
        .from('[data-xs-person]', { opacity: 0, duration: 0.5 }, 1.6)
        .to('[data-xs-back]', { rotate: -78, svgOrigin: '842 286', duration: 0.9 }, 2.6)
        .to('[data-xs-load]', { attr: { x: 650, width: 460 }, duration: 0.9 }, 2.6)
        .to('[data-xs-rearperson]', { opacity: 0, duration: 0.3 }, 2.5)
        .from('[data-xs-long]', { x: 120, opacity: 0, duration: 0.7, ease: 'expo.out' }, 3.3)
        .fromTo('[data-xs-dim]', { scaleX: 0 }, { scaleX: 1, transformOrigin: '1110px 0px', duration: 0.6 }, 3.5)
        .to({}, { duration: 0.6 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="practical"
      ref={root}
      aria-labelledby="practical-title"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink py-20 lg:h-[100svh] lg:py-0"
    >
      <div className="section-pad mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.4fr]">
        <div>
          <p className="eyebrow mb-4">05 — The Estate</p>
          <h2 id="practical-title" className="h-display text-[clamp(1.8rem,4vw,3.6rem)]">
            Room for <span className="font-semibold">everything</span>
          </h2>
          <ol className="mt-8 space-y-1">
            {FEATURES.map((f, i) => {
              const on = active === -1 || active === i;
              const Icon = f.icon;
              return (
                <li
                  key={f.title}
                  className={`rounded-xl border px-4 py-3 transition-all duration-500 ${
                    on ? 'border-white/10 bg-white/[0.04]' : 'border-transparent opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={on ? 'text-signal' : 'text-mist'} aria-hidden />
                    <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">{f.title}</h3>
                  </div>
                  <p
                    className={`overflow-hidden pl-7 text-sm leading-relaxed text-mist transition-all duration-500 ${
                      on ? 'mt-2 max-h-24 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {f.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Cross-section */}
        <figure className="relative">
          <svg viewBox="30 20 1140 410" className="w-full" role="img" aria-label="Cross-section of the estate showing the load area extending as the rear seats fold">
            <defs>
              <clipPath id="xs-clip">
                <path d={OUTLINE} />
              </clipPath>
              <linearGradient id="xs-load" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#6aa7ff" stopOpacity="0.05" />
                <stop offset="1" stopColor="#6aa7ff" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <path d={OUTLINE} fill="#0a0f19" />
            <path d={GREENHOUSE} fill="#0d1522" />
            <g clipPath="url(#xs-clip)">
              <rect data-xs-load x="860" y="96" width="250" height="196" fill="url(#xs-load)" />
            </g>
            {/* floor */}
            <path d="M200,292 L1120,292" stroke="#8fb4ff" strokeOpacity="0.4" strokeWidth="2" />
            {/* front seat */}
            <g fill="#1a2333" stroke="#8fb4ff" strokeOpacity="0.6" strokeWidth="1.5">
              <path d="M500,286 L520,250 L610,248 L618,286 Z" />
              <path d="M600,250 L626,128 C628,118 642,118 642,130 L622,252 Z" />
              <rect x="624" y="104" width="22" height="30" rx="8" />
            </g>
            <g data-xs-person fill="#6aa7ff" fillOpacity="0.25">
              <circle cx="606" cy="120" r="16" />
              <path d="M590,140 L620,140 L612,246 L540,246 L520,286 L500,284 L528,232 L590,232 Z" />
            </g>
            {/* rear seat cushion */}
            <path d="M720,286 L736,258 L836,256 L842,286 Z" fill="#1a2333" stroke="#8fb4ff" strokeOpacity="0.6" strokeWidth="1.5" />
            <g data-xs-rearperson data-xs-person fill="#6aa7ff" fillOpacity="0.25">
              <circle cx="816" cy="140" r="15" />
              <path d="M802,158 L830,158 L826,252 L760,252 L742,286 L724,284 L748,240 L800,240 Z" />
            </g>
            {/* rear backrest (folds) */}
            <g data-xs-back>
              <path d="M830,286 L852,146 C854,136 866,136 866,148 L848,286 Z" fill="#1f2a3d" stroke="#8fb4ff" strokeOpacity="0.8" strokeWidth="1.5" />
              <rect x="852" y="120" width="18" height="28" rx="7" fill="#1f2a3d" stroke="#8fb4ff" strokeOpacity="0.8" strokeWidth="1.5" />
            </g>
            {/* luggage */}
            <g stroke="#cfe0ff" strokeOpacity="0.7" strokeWidth="1.5">
              <rect data-xs-bag x="1020" y="206" width="70" height="86" rx="8" fill="#20314f" />
              <rect data-xs-bag x="930" y="226" width="84" height="66" rx="8" fill="#1b2b47" />
              <rect data-xs-bag x="960" y="168" width="110" height="38" rx="6" fill="#263a5e" />
              <rect data-xs-bag x="880" y="250" width="44" height="42" rx="6" fill="#1b2b47" />
              <rect data-xs-long x="670" y="258" width="300" height="20" rx="4" fill="#355487" />
            </g>
            {/* load length dimension */}
            <g data-xs-dim stroke="#6aa7ff" strokeWidth="1.5">
              <path d="M650,398 L1110,398" />
              <path d="M650,390 L650,406 M1110,390 L1110,406" />
            </g>
            <text x="880" y="425" textAnchor="middle" fill="#8b93a1" fontSize="13" fontFamily="Manrope" letterSpacing="4">
              EXTENDED LOAD LENGTH
            </text>
            <path d={ARCH_F} fill="#05070a" />
            <path d={ARCH_R} fill="#05070a" />
            <circle cx="267" cy="306" r="70" fill="none" stroke="#8fb4ff" strokeOpacity="0.5" strokeWidth="2" />
            <circle cx="917" cy="306" r="70" fill="none" stroke="#8fb4ff" strokeOpacity="0.5" strokeWidth="2" />
            <path
              data-xs-outline
              d={OUTLINE}
              fill="none"
              stroke="#cfe0ff"
              strokeOpacity="0.9"
              strokeWidth="2"
              strokeDasharray="4000"
              strokeDashoffset="0"
            />
          </svg>
          <figcaption className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-mist/70">
            Schematic cross-section · not to scale
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
