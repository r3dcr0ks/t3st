import { useLayoutEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { INTERIOR_SCENES } from '../../config/interior';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { InteriorArt } from './InteriorArt';

const N = INTERIOR_SCENES.length;

export function Interior() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(3);
  const [openHot, setOpenHot] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const isReduced = prefersReducedMotion();
    setReduced(isReduced);
    if (isReduced) return;
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>('[data-scene]');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * N * 0.9}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const f = Math.min(self.progress * N, N - 0.0001);
            const i = Math.floor(f);
            const local = f - i;
            setActive(i);
            // reveal hotspots progressively within each scene
            setStep(local < 0.12 ? 0 : local < 0.3 ? 1 : local < 0.48 ? 2 : 3);
          },
        },
      });
      scenes.forEach((el, i) => {
        if (i === 0) {
          tl.fromTo(el.querySelector('[data-scene-media]'), { scale: 1.08 }, { scale: 1, duration: 1 }, 0);
          return;
        }
        tl.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35, ease: 'power2.inOut' },
          i - 0.15,
        )
          .fromTo(el.querySelector('[data-scene-media]'), { scale: 1.25 }, { scale: 1, duration: 1.2 }, i - 0.15)
          .to(scenes[i - 1].querySelector('[data-scene-media]'), { scale: 0.92, duration: 0.35 }, i - 0.15);
      });
      // pad so timeline length == N: scene i is fully shown during [i, i+1)
      tl.to({}, { duration: Math.max(0.01, N - tl.duration()) });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => setOpenHot(null), [active]);

  const scene = INTERIOR_SCENES[active];

  // Reduced motion: simple stacked layout
  if (reduced) {
    return (
      <section id="interior" aria-labelledby="interior-title" className="section-pad bg-ink py-24">
        <p className="eyebrow mb-3">03 — Interior</p>
        <h2 id="interior-title" className="h-display mb-12 text-[clamp(1.8rem,4.4vw,4rem)]">
          Inside the <span className="font-semibold">cabin</span>
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          {INTERIOR_SCENES.map((s) => (
            <article key={s.key}>
              <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                {s.image ? (
                  <img src={s.image} alt={s.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <InteriorArt name={s.key} />
                )}
              </div>
              <h3 className="mt-4 font-display text-xl uppercase tracking-[0.1em] text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-mist">{s.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="interior"
      ref={root}
      aria-labelledby="interior-title"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-ink lg:flex-row"
    >
      {/* Copy column */}
      <div className="section-pad relative z-10 order-2 flex flex-col justify-between pb-6 pt-5 lg:order-1 lg:w-[38%] lg:pb-14 lg:pt-32">
        <div>
          <p className="eyebrow mb-3 hidden lg:block">03 — Interior</p>
          <h2 id="interior-title" className="h-display hidden text-[clamp(1.8rem,3.6vw,3.6rem)] lg:block">
            Inside the <span className="font-semibold">cabin</span>
          </h2>
          <div className="lg:mt-14" aria-live="polite">
            <div key={scene.key} className="animate-[fadeUp_.7s_cubic-bezier(.2,.8,.2,1)_both]">
              <p className="font-display text-[11px] uppercase tracking-ultra text-signal">
                {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {scene.kicker}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-light uppercase tracking-[0.08em] text-white">
                {scene.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-silver/75 md:text-base">{scene.description}</p>
              <ul className="mt-5 hidden space-y-3 sm:block">
                {scene.hotspots.map((h, j) => (
                  <li
                    key={h.label}
                    className={`flex items-start gap-3 text-sm transition-all duration-500 ${
                      step > j ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                    }`}
                  >
                    <span className="mt-2 h-px w-6 shrink-0 bg-signal" />
                    <span>
                      <span className="font-medium text-white">{h.label}</span>
                      <span className="text-mist"> — {h.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* progress */}
        <div className="mt-5 flex gap-1.5" aria-hidden>
          {INTERIOR_SCENES.map((s, i) => (
            <span key={s.key} className="h-[2px] flex-1 overflow-hidden bg-white/10">
              <span
                className={`block h-full origin-left bg-white transition-transform duration-500 ${
                  i <= active ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Media column */}
      <div className="relative order-1 mt-16 min-h-0 flex-1 lg:order-2 lg:mt-0 lg:p-6 lg:pl-0">
        <div className="relative h-full w-full overflow-hidden lg:rounded-3xl">
          {INTERIOR_SCENES.map((s, i) => (
            <div
              key={s.key}
              data-scene
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: i, clipPath: i === 0 ? undefined : 'inset(100% 0% 0% 0%)' }}
              aria-hidden={i !== active}
            >
              <div data-scene-media className="absolute inset-0 will-change-transform">
                {s.image ? (
                  <img src={s.image} alt={`${s.title} of the Mondeo MK4 Estate`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <InteriorArt name={s.key} />
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              {/* hotspots */}
              {s.hotspots.map((h, j) => {
                const id = `${s.key}-${j}`;
                const visible = i === active && step > j;
                return (
                  <div
                    key={id}
                    className={`ihot transition-all duration-500 ${visible ? 'scale-100 opacity-100' : 'pointer-events-none scale-50 opacity-0'}`}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    <button
                      type="button"
                      className="group relative grid h-9 w-9 place-items-center rounded-full border border-white/80 bg-signal/30 text-white backdrop-blur transition hover:bg-signal"
                      onClick={() => setOpenHot(openHot === id ? null : id)}
                      onMouseEnter={() => setOpenHot(id)}
                      onMouseLeave={() => setOpenHot(null)}
                      aria-expanded={openHot === id}
                      aria-label={h.label}
                      tabIndex={visible ? 0 : -1}
                    >
                      <Plus size={16} className={`transition ${openHot === id ? 'rotate-45' : ''}`} />
                      <span className="absolute inset-0 animate-ping rounded-full border border-signal/60" />
                    </button>
                    <div
                      role="tooltip"
                      className={`absolute left-1/2 top-11 z-10 w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-ink/90 p-3 text-left backdrop-blur-xl transition ${
                        openHot === id ? 'opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
                      }`}
                    >
                      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white">{h.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-mist">{h.text}</p>
                    </div>
                  </div>
                );
              })}
              {!s.image && (
                <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-mist backdrop-blur">
                  Technical illustration · photo to follow
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
