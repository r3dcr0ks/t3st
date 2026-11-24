import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { MapPin, Phone, MessageCircle, Camera, CalendarDays, Send, Mail } from 'lucide-react';
import { useSeller, asNumber, isSet, whatsappLink, display } from '../../context/SellerData';
import { CountUp } from '../ui/CountUp';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

export function Contact() {
  const { data } = useSeller();
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', date: '', time: 'Any time', note: '' });

  const car = `${data.year} ${data.model} Estate`;
  const wa = (msg: string) => whatsappLink(data.whatsappNumber, msg);
  const mail = (subject: string, body: string) =>
    isSet(data.email) ? `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : null;

  const generalMsg = `Hello, I'm interested in your ${car}. Is it still available?`;
  const photosMsg = `Hello, could you please send me additional photographs of the ${car}? Especially: `;
  const viewingMsg = () =>
    [
      `Hello, I'd like to arrange a viewing of the ${car}.`,
      form.name && `Name: ${form.name}`,
      form.date && `Preferred date: ${new Date(form.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`,
      `Preferred time: ${form.time}`,
      form.note && `Note: ${form.note}`,
    ]
      .filter(Boolean)
      .join('\n');

  const price = asNumber(data.askingPrice);
  const tel = data.phoneDisplay.replace(/[^\d+]/g, '');
  const hasContact = Boolean(wa('') || mail('', ''));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const link = wa(viewingMsg()) ?? mail(`Viewing request — ${car}`, viewingMsg());
    if (link) window.open(link, '_blank', 'noopener');
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-ct-line]', {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
      gsap.from('[data-ct-reveal]', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-ct-grid]', start: 'top 85%' },
      });
      gsap.fromTo('[data-ct-bg]', { yPercent: -15 }, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={root} aria-labelledby="contact-title" className="section-pad relative overflow-hidden bg-ink py-28 md:py-40">
      <div aria-hidden data-ct-bg className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[70vh] w-[110vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(43,92,180,0.28),transparent)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <p className="eyebrow mb-6">07 — Purchase</p>
        <h2 id="contact-title" className="h-display text-[clamp(2.2rem,7vw,6.5rem)]">
          <span className="split-line"><span data-ct-line className="inline-block">Ready for its</span></span>
          <span className="split-line"><span data-ct-line className="inline-block font-semibold">next journey?</span></span>
        </h2>

        <div data-ct-grid className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Price + details */}
          <div data-ct-reveal className="glass-panel flex flex-col justify-between p-7 md:p-10">
            <div>
              <p className="eyebrow">Asking price</p>
              <p className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-extralight leading-none text-white">
                {price !== null ? (
                  <>
                    <span className="mr-2 text-[0.5em] text-mist">{data.currency}</span>
                    <CountUp value={price} duration={2.4} />
                  </>
                ) : (
                  <span className="text-[0.45em] uppercase tracking-[0.14em] text-mist">Price on request</span>
                )}
              </p>
              {isSet(data.priceNote) && <p className="mt-3 text-sm text-signal">{data.priceNote}</p>}
            </div>

            <ul className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              <li className="flex items-center justify-between gap-4 py-4">
                <span className="flex items-center gap-3 text-sm text-mist"><MapPin size={16} aria-hidden /> Location</span>
                <span className="text-right text-white">{display(data.location)}</span>
              </li>
              <li className="flex items-center justify-between gap-4 py-4">
                <span className="flex items-center gap-3 text-sm text-mist"><Phone size={16} aria-hidden /> Telephone</span>
                {tel ? (
                  <a href={`tel:${tel}`} className="text-right text-white underline-offset-4 hover:underline">{data.phoneDisplay}</a>
                ) : (
                  <span className="text-right text-white">{display('')}</span>
                )}
              </li>
              {isSet(data.email) && (
                <li className="flex items-center justify-between gap-4 py-4">
                  <span className="flex items-center gap-3 text-sm text-mist"><Mail size={16} aria-hidden /> Email</span>
                  <a href={`mailto:${data.email}`} className="text-right text-white underline-offset-4 hover:underline">{data.email}</a>
                </li>
              )}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={wa(generalMsg) ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!wa('')}
                className={`btn flex-1 bg-[#25D366] text-[#05210f] hover:bg-[#2ee877] ${!wa('') ? 'pointer-events-none opacity-40' : ''}`}
              >
                <MessageCircle size={16} aria-hidden /> WhatsApp the seller
              </a>
              <a
                href={wa(photosMsg) ?? mail(`More photos — ${car}`, photosMsg) ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!hasContact}
                className={`btn-ghost flex-1 ${!hasContact ? 'pointer-events-none opacity-40' : ''}`}
              >
                <Camera size={16} aria-hidden /> Request more photos
              </a>
            </div>
            {!hasContact && (
              <p className="mt-4 text-xs text-amber-300/80">
                Seller: add your WhatsApp number in <code>src/config/vehicle.ts</code> to activate these buttons.
              </p>
            )}
          </div>

          {/* Viewing form */}
          <form data-ct-reveal onSubmit={submit} className="glass-panel p-7 md:p-10" aria-labelledby="viewing-title">
            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-signal" aria-hidden />
              <h3 id="viewing-title" className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Arrange a viewing
              </h3>
            </div>
            <p className="mt-3 text-sm text-mist">
              Pick a time that suits you. Your request opens in WhatsApp, ready to send — nothing is stored on this site.
            </p>
            <div className="mt-8 grid gap-4">
              <label className="grid gap-2">
                <span className="eyebrow !text-[10px]">Your name</span>
                <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="eyebrow !text-[10px]">Preferred date</span>
                  <input
                    type="date"
                    className="field [color-scheme:dark]"
                    value={form.date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="eyebrow !text-[10px]">Time of day</span>
                  <select className="field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                    {['Any time', 'Morning', 'Afternoon', 'Evening', 'Weekend'].map((o) => (
                      <option key={o} className="bg-graphite">{o}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-2">
                <span className="eyebrow !text-[10px]">Message (optional)</span>
                <textarea
                  className="field min-h-[110px] resize-y"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Questions about service history, test drive, part-exchange…"
                />
              </label>
              <button type="submit" className="btn-primary mt-2" disabled={!hasContact}>
                <Send size={15} aria-hidden /> Send viewing request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
