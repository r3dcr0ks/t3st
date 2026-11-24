import { useLayoutEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { CarModel, type CarHandle } from '../car/CarModel';
import { gsap, prefersReducedMotion, scrollToId } from '../../lib/gsap';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const car = useRef<CarHandle>(null);
  const carWrap = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const state = { scrollRy: 34, pointer: 0, pointerY: 0 };
    const apply = () =>
      car.current?.setPose({ ry: state.scrollRy + state.pointer, rx: -7 + state.pointerY });

    const ctx = gsap.context(() => {
      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from(carWrap.current, { opacity: 0, scale: 0.86, y: 40, duration: 2.2, filter: 'blur(12px)' }, 0.15)
          .from('[data-hero-line]', { yPercent: 110, duration: 1.4, stagger: 0.1 }, 0.35)
          .fromTo('[data-hero-fade]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.9)
          .from(state, { scrollRy: 70, duration: 2.6, ease: 'power3.out', onUpdate: apply }, 0.15);

        // Leaving the hero: car rotates toward profile and zooms gently
        gsap.to(state, {
          scrollRy: 12,
          ease: 'none',
          onUpdate: apply,
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to(carWrap.current, {
          scale: 1.12,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('[data-hero-copy]', {
          yPercent: -30,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: '60% top', scrub: true },
        });
      }
      apply();
    }, root);

    // Pointer parallax (desktop only)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || reduced) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      gsap.to(state, { pointer: nx * 8, pointerY: ny * -3, duration: 1.2, ease: 'power3.out', onUpdate: apply });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      className="relative flex min-h-[640px] flex-col overflow-hidden h-[100svh]"
    >
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_68%,rgba(43,92,180,0.32),transparent_70%)]" />
        <div className="glow-drift absolute left-1/2 top-[52%] h-[60vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(106,167,255,0.16),transparent)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-[74%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="light-sweep absolute -inset-x-1/2 top-0 h-full bg-[linear-gradient(100deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 60%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 60%, black, transparent)',
          }}
        />
      </div>

      {/* Copy */}
      <div data-hero-copy className="section-pad relative z-10 pt-28 text-center md:pt-32">
        <p className="eyebrow mb-6 overflow-hidden">
          <span data-hero-line className="inline-block">
            Private sale · Estate · Blue
          </span>
        </p>
        <h1 id="hero-title" className="h-display text-[clamp(2.6rem,9vw,8.5rem)]">
          <span className="split-line">
            <span data-hero-line className="inline-block">
              Ford Mondeo <span className="font-semibold">MK4</span>
            </span>
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl overflow-hidden font-display text-[11px] font-medium uppercase tracking-[0.28em] text-silver/80 sm:text-[13px]">
          <span data-hero-line className="inline-block">
            2010 <span className="mx-2 text-signal">|</span> The perfect balance of space, comfort &amp; performance
          </span>
        </p>
      </div>

      {/* Car */}
      <div className="relative z-0 flex flex-1 items-center justify-center">
        <div ref={carWrap} className="w-[min(175vw,calc((100svh-330px)*2.5))] will-change-transform md:w-[min(1500px,100vw,calc((100svh-470px)*2.5))]">
          <CarModel ref={car} fit={1450} aspect={2.5} initialPose={{ ry: 34, rx: -7 }} />
        </div>
      </div>

      {/* CTA + scroll cue */}
      <div className="section-pad relative z-10 flex flex-col items-center gap-8 pb-10">
        <button data-hero-fade className="btn-primary" onClick={() => scrollToId('exterior')}>
          Explore the vehicle <ArrowDown size={16} />
        </button>
        <div data-hero-fade className="flex items-center gap-3 text-mist" aria-hidden>
          <span className="relative block h-10 w-px overflow-hidden bg-white/15 scroll-cue" />
          <span className="font-display text-[10px] uppercase tracking-ultra">Scroll</span>
        </div>
      </div>
    </section>
  );
}
