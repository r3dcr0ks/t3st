# Ford Mondeo MK4 Estate (2010): sales website

A cinematic, single-page sales presentation for a blue 2010 Ford Mondeo MK4 Estate.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · GSAP (ScrollTrigger + ScrollSmoother) · Lucide icons

```bash
npm install
npm run dev      # local development
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## What the seller edits

| What | Where |
|---|---|
| Specs, price, location, phone, WhatsApp, email | `src/config/vehicle.ts` |
| Gallery photos | `src/config/gallery.ts` (+ files in `public/images/exterior/`) |
| Interior photos and hotspot text | `src/config/interior.ts` (+ files in `public/images/interior/`) |
| Exploded-view component descriptions | `src/config/parts.ts` |

Empty values show as **"To be confirmed"**, so nothing is invented. Numbers (power, displacement,
mileage, price) animate once you fill them in.

**In-browser editor:** open the site with `?edit` in the URL (for example `http://localhost:5173/?edit`).
Edit the fields, then click **Export** and paste the copied JSON into `src/config/vehicle.ts`.
Edits are saved only in your own browser until you do that.

**WhatsApp:** set `whatsappNumber` in international format, digits only (for example `40712345678`).
The WhatsApp, "Request more photos" and "Arrange a viewing" actions then open WhatsApp with a ready-written message.

## About the vehicle visuals

No real 3D model or photos were available, so the car is a **layered vector illustration placed in
CSS 3D space**. It is made of side panels, front and rear faces, and roof, bonnet and glass planes.
It is not a scanned or manufacturer CAD model, and the page says so. The exploded view moves each
layer along its own 3D axis, driven by scroll. Interior scenes and gallery items are clearly
labelled illustrations until real photographs are added.
