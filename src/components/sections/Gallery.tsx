import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GALLERY, type GalleryCategory } from '../../config/gallery';
import { GalleryMedia } from './GalleryMedia';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

const Lightbox = lazy(() => import('./Lightbox'));

const TABS: { id: 'all' | GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<'all' | GalleryCategory>('all');
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const items = useMemo(() => (tab === 'all' ? GALLERY : GALLERY.filter((g) => g.category === tab)), [tab]);
  const item = items[Math.min(index, items.length - 1)];
  const thumbs = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    const n = (i + items.length) % items.length;
    setIndex(n);
    const t = thumbs.current?.children[n] as HTMLElement | undefined;
    t?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-gal-reveal]', {
        opacity: 0,
        y: 50,
        duration: 1.3,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
      gsap.fromTo(
        '[data-gal-stage]',
        { clipPath: 'inset(12% 8% 12% 8% round 24px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 24px)',
          ease: 'none',
          scrollTrigger: { trigger: '[data-gal-stage]', start: 'top 95%', end: 'top 35%', scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={root} aria-labelledby="gallery-title" className="section-pad relative bg-graphite py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div data-gal-reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">06 — Gallery</p>
            <h2 id="gallery-title" className="h-display text-[clamp(1.8rem,4.4vw,4rem)]">
              Every <span className="font-semibold">angle</span>
            </h2>
          </div>
          <div role="tablist" aria-label="Gallery category" className="flex gap-1 rounded-full border border-white/10 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setIndex(0);
                }}
                className={`rounded-full px-5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                  tab === t.id ? 'bg-white text-ink' : 'text-mist hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div data-gal-stage className="group relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl bg-ink sm:aspect-[16/9]">
          <div key={item.id} className="absolute inset-0 animate-[fadeIn_.8s_ease_both]">
            <GalleryMedia item={item} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
            <div className="min-w-0">
              <p className="hidden font-display text-[10px] uppercase tracking-ultra text-mist sm:block">
                {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} · {item.category}
              </p>
              <p className="mt-1 truncate font-display text-sm font-light uppercase tracking-[0.12em] text-white sm:text-lg md:text-2xl">{item.title}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(index - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-white hover:text-ink" aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => go(index + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-white hover:text-ink" aria-label="Next image">
                <ChevronRight size={18} />
              </button>
              <button onClick={() => setLightbox(true)} className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition hover:bg-signal hover:text-white" aria-label="Open fullscreen viewer">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
          <button className="absolute inset-0 -z-0 cursor-zoom-in" style={{ bottom: 96 }} onClick={() => setLightbox(true)} aria-label={`View ${item.title} fullscreen`} />
        </div>

        {/* Thumbnails */}
        <div ref={thumbs} className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Thumbnails">
          {items.map((g, i) => (
            <button
              key={g.id}
              onClick={() => go(i)}
              aria-label={`Show ${g.title}`}
              aria-current={i === index}
              className={`relative aspect-[16/10] w-36 shrink-0 snap-start overflow-hidden rounded-xl border transition duration-300 md:w-44 ${
                i === index ? 'border-white opacity-100' : 'border-white/10 opacity-50 hover:opacity-90'
              }`}
            >
              <GalleryMedia item={g} size="thumb" />
            </button>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-mist/70">
          Images shown are illustrations until the seller’s photographs are added. Real photos replace them in{' '}
          <code className="text-mist">src/config/gallery.ts</code>.
        </p>
      </div>

      {lightbox && (
        <Suspense fallback={null}>
          <Lightbox items={items} start={index} onClose={(i) => { setLightbox(false); setIndex(i); }} />
        </Suspense>
      )}
    </section>
  );
}
