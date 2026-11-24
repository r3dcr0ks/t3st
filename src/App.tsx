import { useLayoutEffect } from 'react';
import { SellerDataProvider } from './context/SellerData';
import { CarDefs } from './components/car/CarDefs';
import { Nav } from './components/sections/Nav';
import { Hero } from './components/sections/Hero';
import { Story } from './components/sections/Story';
import { ExplodedView } from './components/sections/ExplodedView';
import { Interior } from './components/sections/Interior';
import { Specs } from './components/sections/Specs';
import { Practical } from './components/sections/Practical';
import { Gallery } from './components/sections/Gallery';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';
import { EditPanel } from './components/ui/EditPanel';
import { ScrollSmoother, ScrollTrigger, prefersReducedMotion } from './lib/gsap';

/** Rendered before the sections so the smoother exists before their ScrollTriggers are created. */
function SmoothScroll() {
  useLayoutEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const smoother =
      prefersReducedMotion() || isTouch
        ? null
        : ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1.1,
            effects: false,
          });
    // Recalculate once fonts and layout have settled
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      smoother?.kill();
    };
  }, []);
  return null;
}

export default function App() {
  return (
    <SellerDataProvider>
      <CarDefs />
      <SmoothScroll />
      <Nav />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main">
            <Hero />
            <Story />
            <ExplodedView />
            <Interior />
            <Specs />
            <Practical />
            <Gallery />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
      <EditPanel />
    </SellerDataProvider>
  );
}
