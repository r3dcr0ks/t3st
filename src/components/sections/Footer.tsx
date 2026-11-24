import { ArrowUp } from 'lucide-react';
import { scrollToId } from '../../lib/gsap';

export function Footer() {
  return (
    <footer className="section-pad border-t border-white/[0.06] bg-ink py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 text-xs text-mist md:flex-row md:items-center">
        <p>
          <span className="font-display font-bold tracking-[0.3em] text-white">MONDEO</span>
          <span className="ml-3">2010 MK4 Estate · Private sale</span>
        </p>
        <p className="max-w-xl leading-relaxed text-mist/70">
          Independent private listing — not affiliated with or endorsed by Ford Motor Company. Vehicle illustrations are
          stylised representations; refer to the seller’s photographs and documents for the exact condition.
        </p>
        <button onClick={() => scrollToId('top')} className="flex items-center gap-2 uppercase tracking-[0.2em] hover:text-white">
          Top <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
