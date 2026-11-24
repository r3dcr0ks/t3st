import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { defaultSellerData, PLACEHOLDER, type SellerData } from '../config/vehicle';

const STORAGE_KEY = 'mondeo-seller-data-v1';

interface Ctx {
  data: SellerData;
  editMode: boolean;
  update: (key: keyof SellerData, value: string) => void;
  reset: () => void;
}

const SellerCtx = createContext<Ctx | null>(null);

function readEditMode() {
  try {
    return new URLSearchParams(window.location.search).has('edit');
  } catch {
    return false;
  }
}

function readStored(): Partial<SellerData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<SellerData>) : {};
  } catch {
    return {};
  }
}

export function SellerDataProvider({ children }: { children: ReactNode }) {
  const editMode = useMemo(readEditMode, []);
  // Stored overrides are only applied in edit mode, so visitors always see the published config.
  const [data, setData] = useState<SellerData>(() =>
    editMode ? { ...defaultSellerData, ...readStored() } : defaultSellerData,
  );

  const update = useCallback((key: keyof SellerData, value: string) => {
    setData((prev) => {
      const next = { ...prev, [key]: value } as SellerData;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — keep in memory */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(defaultSellerData);
  }, []);

  return <SellerCtx.Provider value={{ data, editMode, update, reset }}>{children}</SellerCtx.Provider>;
}

export function useSeller() {
  const ctx = useContext(SellerCtx);
  if (!ctx) throw new Error('useSeller must be used inside SellerDataProvider');
  return ctx;
}

export const display = (v: string) => (v && v.trim() ? v : PLACEHOLDER);
export const isSet = (v: string) => Boolean(v && v.trim());
export const asNumber = (v: string) => {
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return v && Number.isFinite(n) && n > 0 ? n : null;
};

export function whatsappLink(number: string, message: string) {
  const digits = number.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  return digits ? `https://wa.me/${digits}?text=${text}` : null;
}
