"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used in the project

export function DiscountSection() {
  const [copied, setCopied] = useState(false);
  const couponCode = "WELCOME10";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-primary text-primary-foreground py-20 lg:py-32 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
      {/* Background subtle grid pattern matching the image hints */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "center center",
        }}
      />
      {/* Grid fade masks for the background pattern */}
      {/* <div className="absolute inset-0 bg-primary/80 pointer-events-none" /> */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        {/* Left Column */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8 relative z-10">
          <div className="bg-secondary text-primary px-3 py-1 font-bold uppercase tracking-widest text-[10.5px] sm:text-xs">
            Exclusive Welcome Gift
          </div>

          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tight leading-[0.9] w-full">
            <span className="block text-primary-foreground">The</span>
            <span className="block text-primary-foreground mt-1">Arena Is</span>
            <span className="block text-primary-foreground mt-1">Yours.</span>
            <span className="block text-secondary mt-2">Start</span>
            <span className="block text-secondary mt-1">With</span>
            <span className="block text-secondary mt-1">10% Off.</span>
          </h2>

          <p className="text-primary-foreground/80 max-w-md text-sm sm:text-base leading-relaxed pt-2">
            Every champion needs a home court. We're welcoming you to the elite
            roster with an exclusive discount on your first professional-grade
            booking.
          </p>
        </div>

        {/* Right Column (Coupon Box) */}
        <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
          {/* Decorative Grid local to the right side to match the image precisely */}
          <div
            className="absolute -inset-10 opacity-20 pointer-events-none z-0 hidden lg:block"
            style={{
              backgroundImage:
                "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Dashed Border Coupon Area */}
            <div className="border-[3px] border-secondary border-dashed px-4 py-10 sm:p-14 flex flex-col items-center justify-center text-center gap-5 bg-primary/40 backdrop-blur-sm shadow-xl">
              <p className="text-[10px] sm:text-[11px] text-secondary font-black uppercase tracking-[0.25em]">
                Use code at checkout
              </p>

              <div className="flex items-center gap-3 sm:gap-6">
                <span className="font-display text-4xl sm:text-6xl md:text-[4rem] font-black text-secondary tracking-tight">
                  {couponCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="bg-secondary/15 hover:bg-secondary/25 p-2 sm:p-3 transition-colors shrink-0 group flex items-center justify-center border border-secondary/30"
                  aria-label="Copy coupon code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 sm:w-7 sm:h-7 text-secondary" />
                  ) : (
                    <Copy className="w-5 h-5 sm:w-7 sm:h-7 text-secondary group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            </div>

            {/* CTA Brutalist Button */}
            <div className="relative w-1/2 mx-auto mt-2 lg:ml-8 lg:w-[calc(100%-5rem)]">
              <button className=" w-full bg-secondary text-primary py-5 sm:py-6 px-8 font-black uppercase text-xs sm:text-sm tracking-[0.2em] transition-transform hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0">
                Claim Your Discount
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
