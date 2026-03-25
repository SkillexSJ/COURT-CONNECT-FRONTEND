"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loading() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const dots = dotRefs.current.filter((dot): dot is HTMLSpanElement =>
        Boolean(dot),
      );

      if (dots.length === 0) return;

      const timeline = gsap.timeline({ repeat: -1 });

      timeline
        .to(dots, {
          y: -8,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.1,
        })
        .to(dots, {
          y: 0,
          duration: 0.34,
          ease: "bounce.out",
          stagger: 0.1,
        });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex items-center justify-center bg-background"
    >
      <p className="font-heading text-4xl font-black uppercase tracking-[0.16em] text-primary sm:text-6xl">
        Loading
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            ref={(element) => {
              dotRefs.current[index] = element;
            }}
            className="inline-block text-secondary"
          >
            .
          </span>
        ))}
      </p>
    </div>
  );
}
