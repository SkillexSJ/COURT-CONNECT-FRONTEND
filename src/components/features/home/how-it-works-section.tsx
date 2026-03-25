import { CheckCircle2, Compass, Trophy } from "lucide-react";

import { steps } from "./data";

const icons = [Compass, CheckCircle2, Trophy];
const cardAccentStyles = [
  "before:bg-secondary",
  "before:bg-primary/75",
  "before:bg-secondary/75",
];

export function HowItWorksSection() {
  return (
    <section className="bg-surface px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 md:gap-12 lg:gap-14">
        <div className="text-center lg:text-left">
          {/* <p className="mb-6 inline-block bg-surface-container-low px-4 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-primary">
            The Process
          </p> */}
          <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Elite Access,
            <br />
            <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
              Streamlined.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg lg:mx-0 lg:max-w-lg">
            We removed the barriers between you and the field. Professional
            grade booking for serious athletes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {steps.map((step, index) => {
            const Icon = icons[index] ?? Compass;
            const isLastOddCard =
              steps.length % 2 !== 0 && index === steps.length - 1;
            const accentStyle =
              cardAccentStyles[index % cardAccentStyles.length] ??
              "before:bg-secondary";

            return (
              <article
                key={step.id}
                className={`group relative flex h-full flex-col overflow-hidden border border-primary/15 bg-surface-container-lowest p-5 text-left shadow-[0_20px_40px_-36px_rgba(1,45,29,0.6)] before:absolute before:inset-x-0 before:top-0 before:h-0.75 ${accentStyle} sm:p-6 ${
                  isLastOddCard
                    ? "md:col-span-2 md:mx-auto md:w-full md:max-w-xl lg:col-span-1 lg:max-w-none"
                    : ""
                }`}
              >
                <span className="pointer-events-none absolute right-2 -top-3 md:-top-6 font-display text-[7rem] font-black leading-none tracking-tight text-primary/7 sm:-right-5 sm:text-[10rem]">
                  {step.id}
                </span>

                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center border border-primary/20 bg-primary text-secondary sm:h-16 sm:w-16">
                  <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/60">
                  Step {step.id}
                </p> */}

                <h3 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-primary sm:text-[2rem]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                  {step.description}
                </p>

                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-primary/70">
                    Court Connect Flow
                    <span className="h-px w-8 bg-primary/35" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
