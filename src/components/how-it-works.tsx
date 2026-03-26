"use client";

/**
 * THIS COMPONENT IS HIGHLY INSPIRED FROM CHAMMATIC UI
 */

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { Compass, CalendarDays, Trophy, TrendingUp } from "lucide-react";

interface CardProps {
  number: string;
  title: string;
  description: string;
  icon?: React.ElementType;
  colorTheme?: "primary" | "secondary" | "accent";
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  icon: Icon = Pin,
  colorTheme = "primary",
  className,
  rotate,
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    primary: "bg-primary dark:bg-primary",
    secondary: "bg-secondary dark:bg-secondary",
    accent: "bg-muted dark:bg-card",
  };
  const defaultTextColors = {
    primary: "text-primary-foreground",
    secondary: "text-secondary-foreground",
    accent: "text-foreground",
  };
  const defaultIconColors = {
    primary: "text-primary dark:text-primary",
    secondary: "text-primary dark:text-primary",
    accent: "text-foreground",
  };
  const defaultBorderColors = {
    primary: "border-primary-foreground/20",
    secondary: "border-secondary-foreground/20",
    accent: "border-border",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme];
  const textColor = customColors?.text || defaultTextColors[colorTheme];
  const iconColor = defaultIconColors[colorTheme];
  const borderColor = customColors?.border || defaultBorderColors[colorTheme];

  const descColor =
    colorTheme === "primary"
      ? "text-primary-foreground/80"
      : colorTheme === "secondary"
        ? "text-secondary-foreground/80"
        : "text-muted-foreground";

  return (
    <div
      className={`relative w-full max-sm:max-w-[260px] max-sm:mx-auto md:w-[280px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate} ${className}`}
    >
      <div className="bg-card dark:bg-card/40 p-1.5 md:p-2 rounded-[20px] md:rounded-[25px] shadow-[0px_10px_20px_0px_rgba(1,45,29,0.1)] dark:shadow-none border border-border/50">
        <Icon
          className={`w-6 h-6 md:w-8 md:h-8 ${iconColor} z-20 mb-4 md:mb-6 mx-auto`}
        />
        <div
          className={`${bgColor} border ${borderColor} rounded-[15px] p-4 md:p-[15px] h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-3xl md:text-4xl font-handwriting mb-3 md:mb-5`}
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            }}
          >
            {number}
          </span>
          <h3
            className={`text-xl md:text-2xl font-bold font-display uppercase tracking-tight ${textColor} leading-none mb-2 md:mb-[10px]`}
          >
            {title}
          </h3>
          <p className={`${descColor} text-xs md:text-sm/5 tracking-tight`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  icon?: React.ElementType;
  colorTheme?: "primary" | "secondary" | "accent";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[15%]", rotate: "rotate-8" },
  {
    className: "md:absolute md:top-[120px] md:right-[15%]",
    rotate: "-rotate-8",
  },
  { className: "md:absolute md:top-[450px] md:left-[15%]", rotate: "rotate-8" },
  {
    className: "md:absolute md:top-[570px] md:right-[10%]",
    rotate: "-rotate-8",
  },
  { className: "md:absolute md:top-[850px] md:left-[15%]", rotate: "rotate-8" },
];

export default function HowItWorks({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const defaultFeatures: Step[] = [
    {
      title: "Discover",
      description:
        "Filter by amenities, playing surface, lighting quality, and location across premium venues.",
      colorTheme: "primary",
      icon: Compass,
    },
    {
      title: "Reserve",
      description:
        "Book instantly with integrated payments and confirmation in seconds.",
      colorTheme: "secondary",
      icon: CalendarDays,
    },
    {
      title: "Compete",
      description:
        "Arrive at verified spaces engineered for consistent performance.",
      colorTheme: "primary",
      icon: Trophy,
    },
    {
      title: "Elevate",
      description:
        "Track performance, review your games, and ascend in our elite community.",
      colorTheme: "secondary",
      icon: TrendingUp,
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;

  let height = 1130;
  if (data.length === 1) height = 400;
  else if (data.length === 2) height = 450;
  else if (data.length === 3)
    height = 800; // Perfect for 3 items
  else if (data.length === 4) height = 900;
  else height = 1130;

  return (
    // <LazyMotion features={domAnimation}>
    //   <section
    //     className={`bg-background max-md:pt-10 max-md:pb-25 md:py-20 px-8 relative overflow-hidden ${className}`}
    //   >
    //     <div
    //       className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.1]"
    //       style={{
    //         backgroundImage:
    //           "linear-gradient(var(--foreground) 1px, transparent 1px)",
    //         backgroundSize: "100% 32px",
    //         marginTop: "4px",
    //       }}
    //     ></div>
    //     <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r z-0"></div>
    //     <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l z-0"></div>

    //     <div className=" flex w-full flex-col gap-10 md:gap-16 lg:gap-20 relative z-10">
    //       <div className="text-center lg:text-left z-20 md:px-12">
    //         <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
    //           Elite Access,
    //           <br />
    //           <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
    //             Streamlined.
    //           </span>
    //         </h2>
    //         <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-lg">
    //           We removed the barriers between you and the field. Professional
    //           grade booking for serious athletes.
    //         </p>
    //       </div>

    //       <div
    //         className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block h-auto md:h-[var(--md-height)]"
    //         style={{ "--md-height": `${height}px` } as React.CSSProperties}
    //       >
    //         {data.length > 1 && (
    //           <svg
    //             className="absolute top-[80px] left-0 w-full h-full pointer-events-none hidden md:block z-0"
    //             viewBox={`0 0 1000 ${height}`}
    //             preserveAspectRatio="none"
    //           >
    //             {(() => {
    //               const pathD = data.reduce((acc, _, index) => {
    //                 if (index >= data.length - 1) return acc;
    //                 if (index === 0)
    //                   return "M 290 150 C 500 150, 550 270, 710 270"; // 1 -> 2
    //                 if (index === 1)
    //                   return acc + " C 850 270, 500 350, 290 450"; // 2 -> 3
    //                 if (index === 2)
    //                   return acc + " C 290 600, 550 720, 750 720"; // 3 -> 4
    //                 if (index === 3)
    //                   return acc + " C 950 720, 500 800, 290 850"; // 4 -> 5
    //                 return acc;
    //               }, "");
    //               return (
    //                 <m.path
    //                   d={pathD}
    //                   stroke="currentColor"
    //                   className="text-primary/20 dark:text-primary/10"
    //                   strokeWidth="2"
    //                   strokeDasharray="8 6"
    //                   fill="none"
    //                   strokeLinecap="round"
    //                   vectorEffect="non-scaling-stroke"
    //                   initial={{ strokeDashoffset: 0 }}
    //                   animate={{
    //                     strokeDashoffset: -140, // Multiple of 14 (8+6) for seamless loop
    //                   }}
    //                   transition={{
    //                     duration: 3,
    //                     repeat: Infinity,
    //                     ease: "linear",
    //                   }}
    //                 />
    //               );
    //             })()}
    //           </svg>
    //         )}

    //         {data.map((step, index) => {
    //           const position = positions[index % positions.length];

    //           return (
    //             <Card
    //               key={step.title}
    //               number={`0${index + 1}`}
    //               title={step.title}
    //               description={step.description}
    //               icon={step.icon}
    //               colorTheme={step.colorTheme || "primary"}
    //               colors={step.colors}
    //               rotate={position.rotate}
    //               className={position.className}
    //             />
    //           );
    //         })}
    //       </div>
    //     </div>
    //   </section>
    // </LazyMotion>
    <section
      className={`bg-background max-md:pt-10 max-md:pb-25 md:py-20 px-8 relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "100% 32px",
          marginTop: "4px",
        }}
      ></div>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-linear-to-r z-0"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-linear-to-l z-0"></div>

      <div className=" flex w-full flex-col gap-10 md:gap-16 lg:gap-20 relative z-10">
        <div className="text-center lg:text-left z-20 md:px-12">
          <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Elite Access,
            <br />
            <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
              Streamlined.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-lg">
            We removed the barriers between you and the field. Professional
            grade booking for serious athletes.
          </p>
        </div>

        <div
          className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block h-auto md:h-(--md-height)"
          style={{ "--md-height": `${height}px` } as React.CSSProperties}
        >
          {data.length > 1 && (
            <svg
              className="absolute top-[80px] left-0 w-full h-full pointer-events-none hidden md:block z-0"
              viewBox={`0 0 1000 ${height}`}
              preserveAspectRatio="none"
            >
              {(() => {
                const pathD = data.reduce((acc, _, index) => {
                  if (index >= data.length - 1) return acc;
                  if (index === 0)
                    return "M 290 150 C 500 150, 550 270, 710 270"; // 1 -> 2
                  if (index === 1) return acc + " C 850 270, 500 350, 290 450"; // 2 -> 3
                  if (index === 2) return acc + " C 290 600, 550 720, 750 720"; // 3 -> 4
                  if (index === 3) return acc + " C 950 720, 500 800, 290 850"; // 4 -> 5
                  return acc;
                }, "");
                return (
                  <m.path
                    d={pathD}
                    stroke="currentColor"
                    className="text-primary dark:text-primary"
                    strokeWidth="5"
                    strokeDasharray="8 6"
                    fill="none"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{
                      strokeDashoffset: -140, // Multiple of 14 (8+6) for seamless loop
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                );
              })()}
            </svg>
          )}

          {data.map((step, index) => {
            const position = positions[index % positions.length];

            return (
              <Card
                key={step.title}
                number={`0${index + 1}`}
                title={step.title}
                description={step.description}
                icon={step.icon}
                colorTheme={step.colorTheme || "primary"}
                colors={step.colors}
                rotate={position.rotate}
                className={position.className}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
