import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { GalleryItem } from '../../config/gallery';
import { GalleryMedia } from './GalleryMedia';
import { ScrollSmoother } from '../../lib/gsap';

interface Props {
  items: GalleryItem[];
  start: number;
  onClose: (index: number) => void;
}

const ZOOM = 2.2;

export default function Lightbox({ items, start, onClose }: Props) {
  const [index, setIndex] = useState(start);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = items[index];

  const go = useCallback(
    (d: number) => {
      setZoom(false);
      setIndex((i) => (i + d + items.length) % items.length);
    },
    [items.length],
  );

  const close = useCallback(() => onClose(index), [index, onClose]);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      smoother?.paused(false);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === '+' || e.key === '=') setZoom(true);
      else if (e.key === '-') setZoom(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go]);

  const trackOrigin = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!zoom || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const toggleZoomAt = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    setZoom((z) => !z);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${item.title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl animate-[fadeIn_.35s_ease_both]"
      onKeyDown={(e) => {
        // simple focus trap
        if (e.key !== 'Tab') return;
        const f = e.currentTarget.querySelectorAll<HTMLElement>('button');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <p className="font-display text-[11px] uppercase tracking-ultra text-mist">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          <span className="ml-4 text-white">{item.title}</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setZoom((z) => !z)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white hover:text-ink"
            aria-label={zoom ? 'Zoom out' : 'Zoom in'}
          >
            {zoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>
          <button
            ref={closeBtn}
            onClick={close}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition hover:bg-signal hover:text-white"
            aria-label="Close viewer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20">
        <div
          className={`relative aspect-[16/10] max-h-full w-full max-w-[1600px] overflow-hidden rounded-xl ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onPointerMove={trackOrigin}
          onClick={toggleZoomAt}
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            if (!touch.current || zoom) return;
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div
            key={item.id}
            className="absolute inset-0 animate-[fadeIn_.5s_ease_both] transition-transform duration-500 ease-out"
            style={{ transform: `scale(${zoom ? ZOOM : 1})`, transformOrigin: `${origin.x}% ${origin.y}%` }}
          >
            <GalleryMedia item={item} />
          </div>
        </div>
        <button
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-white hover:text-ink md:left-6"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-white hover:text-ink md:right-6"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-4 py-4 md:justify-center">
        {items.map((g, i) => (
          <button
            key={g.id}
            onClick={() => {
              setZoom(false);
              setIndex(i);
            }}
            aria-label={`Show ${g.title}`}
            aria-current={i === index}
            className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border transition ${
              i === index ? 'border-white' : 'border-white/10 opacity-40 hover:opacity-80'
            }`}
          >
            <GalleryMedia item={g} size="thumb" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
