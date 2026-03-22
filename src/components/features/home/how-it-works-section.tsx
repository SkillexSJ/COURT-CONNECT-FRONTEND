import { CheckCircle2, Compass, Trophy } from "lucide-react";

import { steps } from "./data";

const icons = [Compass, CheckCircle2, Trophy];

export function HowItWorksSection() {
  return (
    <section className="bg-surface px-6 py-28 md:px-12">
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
        <div className="lg:col-span-5">
          <p className="mb-6 inline-block bg-surface-container-low px-4 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-primary">
            The Process
          </p>
          <h2 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-primary md:text-7xl">
            Elite Access,
            <br />
            Streamlined.
          </h2>
          <p className="mt-8 max-w-lg text-lg text-on-surface-variant">
            We removed the barriers between you and the field. Professional
            grade booking for serious athletes.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = icons[index] ?? Compass;

            return (
              <div key={step.id}>
                <div className="mb-6 flex h-16 w-16 items-center justify-center bg-primary text-secondary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-black uppercase tracking-tight text-primary">
                  {step.id}. {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
