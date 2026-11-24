import { useState } from 'react';
import { Pencil, X, Copy, RotateCcw, Check } from 'lucide-react';
import { useSeller } from '../../context/SellerData';
import type { SellerData } from '../../config/vehicle';

const FIELDS: { key: keyof SellerData; label: string; hint?: string }[] = [
  { key: 'engine', label: 'Engine', hint: 'e.g. 2.0 TDCi' },
  { key: 'fuelType', label: 'Fuel type', hint: 'e.g. Diesel' },
  { key: 'transmission', label: 'Transmission', hint: 'e.g. 6-speed manual' },
  { key: 'displacementCc', label: 'Displacement (cc)', hint: 'number' },
  { key: 'horsepower', label: 'Horsepower', hint: 'number' },
  { key: 'mileageKm', label: 'Mileage', hint: 'number' },
  { key: 'mileageUnit', label: 'Mileage unit', hint: 'km or miles' },
  { key: 'exteriorColor', label: 'Exterior colour' },
  { key: 'registration', label: 'Registration status' },
  { key: 'askingPrice', label: 'Asking price', hint: 'number' },
  { key: 'currency', label: 'Currency', hint: '€, £, RON…' },
  { key: 'priceNote', label: 'Price note', hint: 'e.g. Negotiable' },
  { key: 'location', label: 'Location' },
  { key: 'phoneDisplay', label: 'Phone (display)' },
  { key: 'whatsappNumber', label: 'WhatsApp number', hint: 'international digits, e.g. 40712345678' },
  { key: 'email', label: 'Email (optional)' },
];

/** Seller-only editor, shown when the URL contains ?edit */
export function EditPanel() {
  const { data, editMode, update, reset } = useSeller();
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  if (!editMode) return null;

  const copy = async () => {
    const body = JSON.stringify(data, null, 2);
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy these values into src/config/vehicle.ts:', body);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[90] flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink shadow-2xl"
      >
        <Pencil size={14} /> Seller edit
      </button>
      {open && (
        <aside
          aria-label="Seller editor"
          className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-sm flex-col border-l border-white/10 bg-graphite/95 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">Seller editor</p>
              <p className="mt-1 text-xs text-mist">Saved in this browser only. Export to publish.</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close editor" className="text-mist hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {FIELDS.map((f) => (
              <label key={f.key} className="grid gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.14em] text-mist">{f.label}</span>
                <input
                  className="field !py-2.5"
                  value={data[f.key] as string}
                  placeholder={f.hint}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-5">
            <button onClick={reset} className="btn-ghost !px-3 !text-[10px]">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={copy} className="btn-primary !px-3 !text-[10px]">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Export'}
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
