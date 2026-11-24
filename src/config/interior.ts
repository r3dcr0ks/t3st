/**
 * Interior scenes. To use real photographs, drop files into /public/images/interior/
 * and set `image` (e.g. '/images/interior/dashboard.jpg'). Until then a technical
 * illustration is shown. Hotspot positions are percentages of the image area.
 */
export type InteriorArtKey = 'dashboard' | 'steering' | 'cluster' | 'console' | 'frontSeats' | 'rearSeats' | 'boot';

export interface InteriorScene {
  key: InteriorArtKey;
  title: string;
  kicker: string;
  description: string;
  image?: string;
  hotspots: { x: number; y: number; label: string; text: string }[];
}

export const INTERIOR_SCENES: InteriorScene[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    kicker: 'Width you can feel',
    description:
      'A broad, horizontal dashboard sweeps across the cabin, emphasising width and keeping the driver’s sight-lines clean.',
    hotspots: [
      { x: 50, y: 52, label: 'Centre stack', text: 'Audio and climate controls grouped within easy reach of both front occupants.' },
      { x: 46, y: 48, label: 'Air vents', text: 'Centrally mounted vents for fast cabin heating and cooling.' },
      { x: 80, y: 62, label: 'Glovebox', text: 'Passenger-side storage for documents and everyday items.' },
    ],
  },
  {
    key: 'steering',
    title: 'Steering Wheel',
    kicker: 'Everything within reach',
    description:
      'A thick-rimmed wheel sits at the centre of the driving position. Spoke-mounted controls and specification depend on trim level.',
    hotspots: [
      { x: 25, y: 55, label: 'Left spoke', text: 'Spoke-mounted controls where fitted — to be confirmed by the seller.' },
      { x: 50, y: 52, label: 'Hub', text: 'Driver airbag housed in the steering wheel hub.' },
      { x: 50, y: 12, label: 'Rim', text: 'Generous rim diameter for relaxed, precise steering inputs.' },
    ],
  },
  {
    key: 'cluster',
    title: 'Instrument Cluster',
    kicker: 'Read at a glance',
    description: 'Twin analogue dials flank a central information display — clear, calm instrumentation for long drives.',
    hotspots: [
      { x: 30, y: 50, label: 'Rev counter', text: 'Analogue tachometer on the left-hand side.' },
      { x: 70, y: 50, label: 'Speedometer', text: 'Large analogue speedometer on the right-hand side.' },
      { x: 50, y: 52, label: 'Information display', text: 'Central display for trip, fuel and vehicle information.' },
    ],
  },
  {
    key: 'console',
    title: 'Centre Console',
    kicker: 'Organised by design',
    description:
      'The centre console separates driver and passenger with the gear selector, parking brake, cupholders and an armrest with storage.',
    hotspots: [
      { x: 50, y: 34, label: 'Gear selector', text: 'Transmission type to be confirmed — see specifications.' },
      { x: 43, y: 64, label: 'Cupholders', text: 'Front cupholders positioned ahead of the armrest.' },
      { x: 50, y: 90, label: 'Armrest', text: 'Front armrest with storage compartment beneath.' },
    ],
  },
  {
    key: 'frontSeats',
    title: 'Front Seats',
    kicker: 'Built for distance',
    description:
      'Supportive, well-bolstered front seats designed for comfort over long distances. Upholstery and adjustment type to be confirmed.',
    hotspots: [
      { x: 28, y: 18, label: 'Head restraint', text: 'Height-adjustable head restraints for each front seat.' },
      { x: 18, y: 50, label: 'Side bolsters', text: 'Shaped bolsters hold occupants in place through corners.' },
      { x: 72, y: 78, label: 'Seat cushion', text: 'Long seat cushion for thigh support on long journeys.' },
    ],
  },
  {
    key: 'rearSeats',
    title: 'Rear Seats',
    kicker: 'Room for real people',
    description:
      'The long wheelbase gives rear passengers genuine legroom. The backrest splits and folds to extend the load area.',
    hotspots: [
      { x: 60, y: 40, label: 'Split backrest', text: 'Asymmetric split-folding backrest for flexible seating and loading.' },
      { x: 22, y: 76, label: 'Child-seat anchors', text: 'Child-seat mounting points on the outer rear seats — confirm on viewing.' },
      { x: 50, y: 16, label: 'Three head restraints', text: 'Three rear seating positions with individual head restraints.' },
    ],
  },
  {
    key: 'boot',
    title: 'Luggage Compartment',
    kicker: 'The estate advantage',
    description:
      'A long, square load bay with a wide opening and low lip. Fold the rear seats and the floor extends almost to the front seats.',
    hotspots: [
      { x: 50, y: 82, label: 'Low loading lip', text: 'Heavy items slide in rather than being lifted over a high sill.' },
      { x: 50, y: 50, label: 'Flat load floor', text: 'A long, flat floor for suitcases, prams, bikes and boxes.' },
      { x: 50, y: 22, label: 'Folding seat backs', text: 'Rear backrests fold to extend the load length.' },
    ],
  },
];
