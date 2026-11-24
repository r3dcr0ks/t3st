import { useLayoutEffect, useRef } from 'react';
import { Gauge, Fuel, Cog, Box, Zap, Route, Palette, FileCheck2, type LucideIcon } from 'lucide-react';
import { useSeller, asNumber, display, isSet } from '../../context/SellerData';
import type { SellerData } from '../../config/vehicle';
import { CountUp } from '../ui/CountUp';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

interface Row {
  key: keyof SellerData;
  label: string;
  icon: LucideIcon;
  unit?: string;
  numeric?: boolean;
}

const ROWS: Row[] = [
  { key: 'engine', label: 'Engine', icon: Cog },
  { key: 'fuelType', label: 'Fuel type', icon: Fuel },
  { key: 'transmission', label: 'Transmission', icon: Gauge },
  { key: 'displacementCc', label: 'Engine displacement', icon: Box, unit: 'cc', numeric: true },
  { key: 'horsepower', label: 'Power output', icon: Zap, unit: 'hp', numeric: true },
  { key: 'mileageKm', label: 'Mileage', icon: Route, numeric: true },
  { key: 'exteriorColor', label: 'Exterior colour', icon: Palette },
  { key: 'registration', label: 'Registration status', icon: FileCheck2 },
];

export function Specs() {
  const { data } = useSeller();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-spec]', { opacity: 0, y: 40 }, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-spec-grid]', start: 'top 80%' },
      });
      gsap.from('[data-spec-head]', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
      gsap.fromTo(
        '[data-spec-line]',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 20%', scrub: true } },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const unitFor = (r: Row) => (r.key === 'mileageKm' ? data.mileageUnit : r.unit);

  return (
    <section id="specs" ref={root} aria-labelledby="specs-title" className="section-pad relative bg-graphite py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div data-spec-head>
            <p className="eyebrow mb-4">04 — Specifications</p>
            <h2 id="specs-title" className="h-display text-[clamp(1.8rem,4.4vw,4rem)]">
              The <span className="font-semibold">numbers</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-mist">
              Only confirmed details are shown. Anything still marked “To be confirmed” will be provided by the seller —
              nothing here is estimated or assumed.
            </p>
          </div>
          <dl data-spec-head className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
            {[
              ['Model year', <CountUp key="y" value={Number(data.year)} format={(n) => String(Math.round(n))} />],
              ['Generation', data.generation],
              ['Body', 'Estate'],
              ['Model', 'Mondeo'],
            ].map(([k, v]) => (
              <div key={String(k)} className="bg-graphite p-5">
                <dt className="eyebrow !text-[9px]">{k}</dt>
                <dd className="mt-2 font-display text-2xl font-light text-white md:text-3xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-spec-line className="my-14 h-px origin-left bg-gradient-to-r from-signal via-white/30 to-transparent" />

        <dl data-spec-grid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROWS.map((r) => {
            const value = data[r.key] as string;
            const num = r.numeric ? asNumber(value) : null;
            const known = isSet(value);
            const Icon = r.icon;
            return (
              <div
                key={r.key}
                data-spec
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition duration-500 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-signal/10 opacity-0 blur-2xl transition duration-700 group-hover:opacity-100" />
                <Icon size={18} className="text-signal" aria-hidden />
                <dt className="eyebrow mt-6 !text-[10px]">{r.label}</dt>
                <dd className="mt-2 min-h-[2.5rem]">
                  {num !== null ? (
                    <span className="font-display text-3xl font-light text-white">
                      <CountUp value={num} />
                      <span className="ml-1.5 text-sm text-mist">{unitFor(r)}</span>
                    </span>
                  ) : known ? (
                    <span className="font-display text-xl font-light text-white">{value}</span>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.14em] text-mist/70">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400/80" />
                      {display(value)}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
