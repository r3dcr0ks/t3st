import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { scrollToId } from '../../lib/gsap';

const LINKS = [
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'specs', label: 'Specifications' },
  { id: 'practical', label: 'Estate' },
  { id: 'gallery', label: 'Gallery' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'bg-ink/70 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="section-pad flex h-16 items-center justify-between md:h-20">
        <button onClick={() => go('top')} className="group flex items-baseline gap-3 text-left" aria-label="Back to top">
          <span className="font-display text-[13px] font-bold tracking-[0.34em] text-white">MONDEO</span>
          <span className="hidden font-display text-[10px] font-medium tracking-[0.3em] text-mist sm:inline">
            MK4 · ESTATE · 2010
          </span>
        </button>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-mist transition hover:text-white"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button onClick={() => go('contact')} className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Enquire
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`section-pad overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        hidden={!open}
      >
        <ul className="flex flex-col gap-1 pb-8 pt-2">
          {[...LINKS, { id: 'contact', label: 'Contact' }].map((l, i) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="flex w-full items-baseline gap-4 border-b border-white/[0.06] py-4 text-left"
              >
                <span className="font-display text-[10px] text-mist">0{i + 1}</span>
                <span className="font-display text-xl font-light uppercase tracking-[0.12em] text-white">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
