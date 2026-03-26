/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import Image from "next/image";

const partners = [
  { name: "Nike", logo: "NIKE" },
  { name: "Adidas", logo: "ADIDAS" },
  { name: "Puma", logo: "PUMA" },
  { name: "Under Armour", logo: "UNDER ARMOUR" },
  { name: "Wilson Sports", logo: "WILSON" },
  { name: "Decathlon", logo: "DECATHLON" },
];

export function AboutPartners() {
  return (
    <section className="py-20 mb-10 sm:py-28 px-4 sm:px-6 lg:px-8  text-secondary-foreground">
      <div className="max-w-360 mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black uppercase tracking-[0.18em]  mb-4">
            Trusted By
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-secondary-foreground">
            Industry Leaders
            <br />
            <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
              & Partners
            </span>
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            We're backed and partnered with the world's leading sports brands.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {partners.map((partner, idx) => (
            <div key={idx} className="flex items-center justify-center ">
              <div className="w-full h-full bg-primary-foreground/5 flex items-center justify-center rounded">
                <Image
                  src={`/images/placeholders/${partner.name.replace(/\s+/g, "-").toLowerCase()}.svg`}
                  alt={partner.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Partnership CTA */}
        <div className="border-t border-primary-foreground/20">
          <p className="text-sm text-secondary-foreground/80 text-center mb-6">
            Are you a brand or venue operator interested in partnering with us?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="mailto:partners@courtconnect.com"
              className="inline-flex w-1/3 mx-auto items-center justify-center bg-secondary text-secondary-foreground px-6 py-3 font-bold uppercase text-xs tracking-[0.12em] hover:bg-secondary/90 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
