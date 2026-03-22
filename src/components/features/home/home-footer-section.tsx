const companyLinks = ["Our Story", "Journal", "Careers", "Contact"];
const solutionLinks = [
  "For Athletes",
  "For Venue Owners",
  "Memberships",
  "Corporate",
];

export function HomeFooterSection() {
  return (
    <footer className="bg-primary px-6 pb-12 pt-24 text-surface md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-3xl font-black uppercase tracking-tight text-secondary">
              The Athletic
            </p>
            <p className="mt-6 max-w-sm text-surface/70">
              Defining a new generation of sports accessibility for athletes and
              venue owners.
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Company
            </p>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-surface/70">
              {companyLinks.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Solutions
            </p>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-surface/70">
              {solutionLinks.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Newsletter
            </p>
            <p className="mb-6 text-sm text-surface/70">
              Join the Inner Circle for weekly updates on new venue openings.
            </p>
            <div className="flex items-center gap-3 border-b border-surface/20 pb-3">
              <input
                placeholder="Enter email address"
                className="w-full bg-transparent text-sm uppercase tracking-widest text-surface"
              />
              <button className="text-secondary">Send</button>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-surface/10 pt-8 text-[10px] font-bold uppercase tracking-widest text-surface/40">
          © 2026 The Athletic Elite Arena
        </div>
      </div>
    </footer>
  );
}
