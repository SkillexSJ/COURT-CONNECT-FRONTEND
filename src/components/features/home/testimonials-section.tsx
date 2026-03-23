/* eslint-disable @next/next/no-img-element */

import { Quote } from "lucide-react";

import { testimonials } from "./data";

export function TestimonialsSection() {
  return (
    <section className="bg-surface-container-low px-6 py-28 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <h2 className="mb-12 font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-primary md:text-7xl lg:text-8xl">
          Athlete
          <br />
          <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
            Perspectives
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="bg-surface p-8">
              <Quote className="mb-6 h-10 w-10 text-secondary/60" />
              <p className="mb-8 text-lg italic leading-relaxed text-on-surface">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-display text-sm font-bold uppercase text-primary">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {item.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
