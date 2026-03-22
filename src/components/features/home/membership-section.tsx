import { CheckCircle2 } from "lucide-react";

import { memberships } from "./data";

export function MembershipSection() {
  return (
    <section className="bg-surface px-6 py-28 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-16 text-center">
          <h2 className="font-display text-5xl font-black uppercase tracking-tight text-primary md:text-7xl">
            The Inner Circle
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
            Exclusive benefits for athletes who train with intent.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {memberships.map((plan) => (
            <article
              key={plan.id}
              className={
                plan.featured
                  ? "bg-primary p-10 text-surface"
                  : "bg-surface-container-low p-10"
              }
            >
              <h3
                className={
                  plan.featured
                    ? "font-display text-3xl font-black uppercase text-secondary"
                    : "font-display text-3xl font-black uppercase text-primary"
                }
              >
                {plan.name}
              </h3>
              <p
                className={
                  plan.featured
                    ? "mt-4 text-surface/70"
                    : "mt-4 text-on-surface-variant"
                }
              >
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.perks.map((perk) => (
                  <li
                    key={perk}
                    className={
                      plan.featured
                        ? "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-surface"
                        : "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"
                    }
                  >
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-end justify-between">
                <p
                  className={
                    plan.featured
                      ? "font-display text-4xl font-black text-secondary"
                      : "font-display text-4xl font-black text-primary"
                  }
                >
                  ${plan.price}
                  <span
                    className={
                      plan.featured
                        ? "ml-1 text-xs text-surface/70"
                        : "ml-1 text-xs text-on-surface-variant"
                    }
                  >
                    /{plan.period}
                  </span>
                </p>
                <button
                  className={
                    plan.featured
                      ? "btn-primary px-6 py-3 text-xs font-bold uppercase tracking-widest"
                      : "bg-primary px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-surface"
                  }
                >
                  Select Plan
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
