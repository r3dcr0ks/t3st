/**
 * ─────────────────────────────────────────────────────────────
 *  SELLER CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 *  Everything the seller needs to edit lives in this file.
 *
 *  • Leave a value as an empty string ('') until it is confirmed —
 *    the site then shows "To be confirmed" instead of inventing data.
 *  • Numeric fields (horsepower, displacement, mileage) animate when
 *    filled in with a number.
 *  • You can also open the site with  ?edit  in the URL to edit these
 *    values in the browser and export them back into this file.
 */

export interface SellerData {
  // Fixed vehicle identity
  model: string;
  year: string;
  bodyType: string;
  generation: string;

  // Editable specifications — fill in when confirmed
  engine: string; // e.g. "2.0 TDCi Duratorq"
  fuelType: string; // e.g. "Diesel"
  transmission: string; // e.g. "6-speed manual"
  displacementCc: string; // number in cc, e.g. "1997"
  horsepower: string; // number in PS / hp, e.g. "140"
  mileageKm: string; // number, e.g. "187000"
  mileageUnit: 'km' | 'miles';
  exteriorColor: string;
  registration: string; // e.g. "Registered until 03/2027"

  // Sale details
  askingPrice: string; // number, e.g. "4950"
  currency: string; // e.g. "€", "£", "RON"
  priceNote: string; // e.g. "Negotiable"
  location: string; // e.g. "Cluj-Napoca, Romania"
  phoneDisplay: string; // as shown on screen, e.g. "+40 712 345 678"
  whatsappNumber: string; // international format, digits only, e.g. "40712345678"
  email: string; // optional
}

export const defaultSellerData: SellerData = {
  model: 'Ford Mondeo MK4',
  year: '2010',
  bodyType: 'Estate / Break (Turnier)',
  generation: 'MK4',

  engine: '',
  fuelType: '',
  transmission: '',
  displacementCc: '',
  horsepower: '',
  mileageKm: '',
  mileageUnit: 'km',
  exteriorColor: 'Blue',
  registration: '',

  askingPrice: '',
  currency: '€',
  priceNote: '',
  location: '',
  phoneDisplay: '',
  whatsappNumber: '',
  email: '',
};

export const PLACEHOLDER = 'To be confirmed';
