import type { CarPose } from '../components/car/CarModel';
import type { InteriorArtKey } from './interior';

/**
 * GALLERY
 * ───────
 * To use real photographs:
 *   1. Copy them into /public/images/exterior/ or /public/images/interior/
 *   2. Set `src` on an item, e.g. src: '/images/exterior/front.jpg'
 *   3. Write a short, descriptive `alt` text.
 * Items without `src` render an illustrated placeholder (clearly labelled).
 * You can add or remove items freely.
 */
export type GalleryCategory = 'exterior' | 'interior';

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  title: string;
  alt: string;
  src?: string;
  /** Placeholder rendering when no photo is supplied */
  placeholder:
    | { kind: 'car'; pose: Partial<CarPose>; tone?: 'studio' | 'dusk' | 'night' }
    | { kind: 'interior'; art: InteriorArtKey };
}

export const GALLERY: GalleryItem[] = [
  {
    id: 'ext-front',
    category: 'exterior',
    title: 'Front three-quarter',
    alt: 'Blue 2010 Ford Mondeo MK4 Estate, front three-quarter view',
    placeholder: { kind: 'car', pose: { ry: 32, rx: -7 }, tone: 'studio' },
  },
  {
    id: 'ext-side',
    category: 'exterior',
    title: 'Profile',
    alt: 'Blue Ford Mondeo MK4 Estate, side profile',
    placeholder: { kind: 'car', pose: { ry: 0, rx: -2 }, tone: 'dusk' },
  },
  {
    id: 'ext-rear',
    category: 'exterior',
    title: 'Rear three-quarter',
    alt: 'Blue Ford Mondeo MK4 Estate, rear three-quarter view',
    placeholder: { kind: 'car', pose: { ry: -34, rx: -7 }, tone: 'studio' },
  },
  {
    id: 'ext-front-high',
    category: 'exterior',
    title: 'Front, elevated',
    alt: 'Blue Ford Mondeo MK4 Estate, elevated front view',
    placeholder: { kind: 'car', pose: { ry: 58, rx: -16 }, tone: 'night' },
  },
  {
    id: 'ext-rear-high',
    category: 'exterior',
    title: 'Rear, elevated',
    alt: 'Blue Ford Mondeo MK4 Estate, elevated rear view',
    placeholder: { kind: 'car', pose: { ry: -60, rx: -16 }, tone: 'dusk' },
  },
  {
    id: 'ext-low',
    category: 'exterior',
    title: 'Low angle',
    alt: 'Blue Ford Mondeo MK4 Estate, low-angle front view',
    placeholder: { kind: 'car', pose: { ry: 20, rx: 2 }, tone: 'night' },
  },
  { id: 'int-dash', category: 'interior', title: 'Dashboard', alt: 'Dashboard of the Mondeo MK4', placeholder: { kind: 'interior', art: 'dashboard' } },
  { id: 'int-wheel', category: 'interior', title: 'Steering wheel', alt: 'Steering wheel', placeholder: { kind: 'interior', art: 'steering' } },
  { id: 'int-cluster', category: 'interior', title: 'Instruments', alt: 'Instrument cluster', placeholder: { kind: 'interior', art: 'cluster' } },
  { id: 'int-console', category: 'interior', title: 'Centre console', alt: 'Centre console', placeholder: { kind: 'interior', art: 'console' } },
  { id: 'int-front', category: 'interior', title: 'Front seats', alt: 'Front seats', placeholder: { kind: 'interior', art: 'frontSeats' } },
  { id: 'int-rear', category: 'interior', title: 'Rear seats', alt: 'Rear seats', placeholder: { kind: 'interior', art: 'rearSeats' } },
  { id: 'int-boot', category: 'interior', title: 'Luggage compartment', alt: 'Luggage compartment', placeholder: { kind: 'interior', art: 'boot' } },
];
