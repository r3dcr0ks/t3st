import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

interface Props {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB');

/** Counts up from 0 when scrolled into view. */
export function CountUp({ value, format = fmt, duration = 2, className }: Props) {
  const el = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const node = el.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.textContent = format(value);
      return;
    }
    const obj = { n: 0 };
    node.textContent = format(0);
    const tween = gsap.to(obj, {
      n: value,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        node.textContent = format(obj.n);
      },
      scrollTrigger: { trigger: node, start: 'top 90%', once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, duration, format]);

  return (
    <span ref={el} className={className} aria-label={format(value)}>
      {format(value)}
    </span>
  );
}
