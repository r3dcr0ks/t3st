import { useLayoutEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { CarModel, type CarHandle } from '../car/CarModel';
import { PARTS, PART_BY_ID, type PartId } from '../../config/parts';
import { gsap, lerp, prefersReducedMotion, smoothstep } from '../../lib/gsap';

const PHASES = [
  { at: 0, label: 'Assembled', text: 'One continuous form — the Kinetic Design shoulder line runs from headlamp to tail-lamp.' },
  { at: 0.2, label: 'Deconstruction', text: 'Panels lift away from the body-in-white along their natural mounting axes.' },
  { at: 0.4, label: 'Components', text: 'Hover or tap a marker to inspect each exterior component.' },
  { at: 0.72, label: 'Reassembly', text: 'Every panel returns to its place — tight shut-lines, one coherent shape.' },
];

export function ExplodedView() {
  const root = useRef<HTMLElement>(null);
  const car = useRef<CarHandle>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [phase, setPhase] = useState(0);
  const [exploded, setExploded] = useState(false);
  const reduced = useRef(false);

  useLayoutEffect(() => {
    reduced.current = prefersReducedMotion();
    if (reduced.current) {
      // Static, fully explored state: exploded, hotspots active
      car.current?.setPose({ explode: 1, ry: 18, rx: -8 });
      setExploded(true);
      setPhase(2);
      return;
    }
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3.4}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const e = smoothstep(0.08, 0.36, p) * (1 - smoothstep(0.7, 0.94, p));
            const ry = lerp(30, -30, smoothstep(0.02, 0.98, p));
            const rx = -9 + Math.sin(p * Math.PI) * 3;
            car.current?.setPose({ explode: e, ry, rx });
            if (bar.current) bar.current.style.transform = `scaleX(${p})`;
            const idx = PHASES.reduce((acc, ph, i) => (p >= ph.at ? i : acc), 0);
            setPhase(idx);
            const isEx = e > 0.72;
            setExploded(isEx);
            if (!isEx) setSelected(null);
          },
        },
      });
      gsap.from('[data-ex-reveal]', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const info = selected ? PART_BY_ID[selected] : null;
  const idx = selected ? PARTS.findIndex((p) => p.id === selected) + 1 : 0;

  return (
    <section
      id="exterior"
      ref={root}
      aria-labelledby="exterior-title"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-graphite"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_55%,rgba(43,92,180,0.18),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 55%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 55%, black, transparent)',
          }}
        />
      </div>

      {/* Header */}
      <div className="section-pad relative z-10 flex items-start justify-between gap-6 pt-24 md:pt-28">
        <div data-ex-reveal>
          <p className="eyebrow mb-3">02 — Exterior · Exploded view</p>
          <h2 id="exterior-title" className="h-display text-[clamp(1.8rem,4.4vw,4rem)]">
            Engineered <span className="font-semibold">in layers</span>
          </h2>
        </div>
        <div data-ex-reveal className="hidden text-right md:block" aria-live="polite">
          <p className="font-display text-[10px] uppercase tracking-ultra text-mist">
            Phase 0{phase + 1} / 0{PHASES.length}
          </p>
          <p className="mt-2 font-display text-lg font-light uppercase tracking-[0.16em] text-white">
            {PHASES[phase].label}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist">{PHASES[phase].text}</p>
        </div>
      </div>

      {/* Car */}
      <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center">
        <div className="w-[min(1500px,150vw)] md:w-[min(1400px,96vw)]">
          <CarModel
            ref={car}
            fit={1900}
            aspect={2.1}
            initialPose={{ explode: 0, ry: 30, rx: -9 }}
            selected={selected}
            onSelect={setSelected}
            showHotspots={exploded}
          />
        </div>
      </div>

      {/* Info panel */}
      <div
        className={`section-pad pointer-events-none absolute inset-x-0 bottom-[148px] z-20 flex justify-center transition-all duration-500 md:bottom-auto md:left-auto md:right-0 md:top-1/2 md:-translate-y-1/2 md:justify-end ${
          info ? 'opacity-100' : 'translate-y-3 opacity-0'
        }`}
        aria-live="polite"
      >
        {info && (
          <div className="glass-panel pointer-events-auto w-full max-w-sm p-6 md:w-80">
            <p className="font-display text-[10px] uppercase tracking-ultra text-signal">
              Component {String(idx).padStart(2, '0')}
            </p>
            <h3 className="mt-2 font-display text-2xl font-light uppercase tracking-[0.1em] text-white">{info.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-silver/80">{info.description}</p>
          </div>
        )}
      </div>

      {/* Legend + progress */}
      <div className="relative z-10 pb-6 md:pb-8">
        <div className="section-pad no-scrollbar flex gap-2 overflow-x-auto pb-4 md:flex-wrap md:justify-center">
          {PARTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              disabled={!exploded}
              aria-pressed={selected === p.id}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.18em] transition duration-300 disabled:opacity-30 ${
                selected === p.id
                  ? 'border-signal bg-signal/20 text-white'
                  : 'border-white/10 text-mist hover:border-white/40 hover:text-white'
              }`}
            >
              <span className="mr-1.5 text-white/40">{String(i + 1).padStart(2, '0')}</span>
              {p.name}
            </button>
          ))}
        </div>
        <div className="section-pad flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-gradient-to-r from-signal to-white" />
          </div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-mist/70">
            <Info size={12} aria-hidden /> Illustrative layered vector model — not manufacturer CAD data
          </p>
        </div>
      </div>
    </section>
  );
}
