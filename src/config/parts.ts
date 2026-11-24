export type PartId =
  | 'frontBumper'
  | 'grille'
  | 'headlights'
  | 'hood'
  | 'roof'
  | 'frontDoor'
  | 'rearDoor'
  | 'mirror'
  | 'wheels'
  | 'tailgate'
  | 'rearLights'
  | 'rearBumper';

export interface PartInfo {
  id: PartId;
  name: string;
  description: string;
}

/** Descriptions are about the MK4 Estate's design, not unverified equipment of this specific car. */
export const PARTS: PartInfo[] = [
  {
    id: 'frontBumper',
    name: 'Front Bumper',
    description:
      'Sculpted front fascia that frames the lower air intake and absorbs low-speed knocks before they reach the structure behind it.',
  },
  {
    id: 'grille',
    name: 'Front Grille',
    description:
      'Large trapezoidal lower grille paired with a slim upper grille — the signature face of Ford’s Kinetic Design era.',
  },
  {
    id: 'headlights',
    name: 'Headlights',
    description:
      'Swept-back headlamp units that wrap deep into the front wings, giving the Mondeo its wide, alert expression.',
  },
  {
    id: 'hood',
    name: 'Bonnet',
    description: 'Long bonnet with sculpted power lines, covering the transversely mounted engine bay.',
  },
  {
    id: 'roof',
    name: 'Roof',
    description:
      'Long, flat estate roofline carried right to the tailgate, preserving rear headroom and load height.',
  },
  {
    id: 'frontDoor',
    name: 'Front Doors',
    description: 'Wide-opening framed front doors with integrated side-impact structure and a rising beltline.',
  },
  {
    id: 'rearDoor',
    name: 'Rear Doors',
    description: 'Full-size rear doors shaped around the wheel arch for easy access to the rear bench.',
  },
  {
    id: 'mirror',
    name: 'Side Mirrors',
    description: 'Aerodynamically shaped door mirrors positioned at the base of the A-pillar for a clear rear view.',
  },
  {
    id: 'wheels',
    name: 'Wheels',
    description:
      'Alloy wheels pushed to the corners of a long wheelbase for stability. Wheel size and tyre specification to be confirmed by the seller.',
  },
  {
    id: 'tailgate',
    name: 'Tailgate',
    description: 'Large, wide-opening tailgate with a deep rear window, giving direct access to the long, flat load floor.',
  },
  {
    id: 'rearLights',
    name: 'Rear Lights',
    description: 'Tall tail-lamp clusters set into the rear pillars, visible high up in traffic.',
  },
  {
    id: 'rearBumper',
    name: 'Rear Bumper',
    description: 'Rear bumper with a low loading lip, protecting the paintwork during everyday loading.',
  },
];

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p])) as Record<PartId, PartInfo>;
