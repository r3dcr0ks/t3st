import type { GalleryItem } from '../../config/gallery';
import { CarModel } from '../car/CarModel';
import { InteriorArt } from './InteriorArt';
import { asset } from '../../lib/asset';

const TONES = {
  studio: 'bg-[radial-gradient(ellipse_70%_60%_at_50%_60%,#1e3563_0%,#0a0e16_55%,#050608_100%)]',
  dusk: 'bg-[linear-gradient(180deg,#1a1f2e_0%,#2a2233_45%,#0a0b10_70%,#050608_100%)]',
  night: 'bg-[radial-gradient(ellipse_50%_40%_at_50%_75%,#24467f_0%,#070a12_60%,#030405_100%)]',
} as const;

/** Renders a gallery item: a real photo if `src` is set, otherwise a labelled illustration. */
export function GalleryMedia({ item, size = 'full' }: { item: GalleryItem; size?: 'full' | 'thumb' }) {
  if (item.src) {
    return (
      <img
        src={asset(item.src)}
        alt={item.alt}
        loading={size === 'thumb' ? 'lazy' : 'eager'}
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />
    );
  }
  const ph = item.placeholder;
  return (
    <div className="relative h-full w-full" role="img" aria-label={`${item.alt} (illustration)`}>
      {ph.kind === 'car' ? (
        <div className={`absolute inset-0 flex items-center justify-center ${TONES[ph.tone ?? 'studio']}`}>
          <div className="absolute inset-x-0 top-[66%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="w-[96%]">
            <CarModel fit={1350} aspect={2.2} initialPose={{ explode: 0, ...ph.pose }} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          <InteriorArt name={ph.art} />
        </div>
      )}
      {size === 'full' && (
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-mist backdrop-blur">
          Illustration · photograph to follow
        </span>
      )}
    </div>
  );
}
