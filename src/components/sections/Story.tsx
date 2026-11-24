import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

const STATEMENT =
  'Long roof. Long wheelbase. Long journeys. The Mondeo Estate was drawn in the Kinetic Design era — a car that looks in motion when standing still, and carries a family’s life without complaint.';

export function Story() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      );
      gsap.from('[data-story-meta]', {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-story-meta]', start: 'top 85%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="Introduction" className="section-pad relative py-32 md:py-48">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-10">01 — The Story</p>
        <p
          data-statement
          className="font-display text-[clamp(1.6rem,3.6vw,3.4rem)] font-light leading-[1.18] tracking-[-0.01em] text-white"
        >
          {STATEMENT.split(' ').map((w, i) => (
            <span key={i} data-word className="inline-block pr-[0.28em]">
              {w}
            </span>
          ))}
        </p>
        <div className="mt-20 grid gap-10 border-t border-white/[0.08] pt-10 sm:grid-cols-3">
          {[
            ['Generation', 'MK4 · 2007–2014 series', 'The fourth-generation Mondeo, built on Ford’s large-car platform.'],
            ['Body', 'Estate / Turnier', 'The longest, most practical version of the range.'],
            ['This car', 'Model year 2010 · Blue', 'Offered for private sale — explore every detail below.'],
          ].map(([k, v, d]) => (
            <div key={k} data-story-meta>
              <p className="eyebrow mb-3">{k}</p>
              <p className="font-display text-lg font-medium text-white">{v}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
