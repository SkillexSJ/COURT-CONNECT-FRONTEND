import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="whitespace-nowrap font-display text-base font-black uppercase tracking-tight text-primary sm:text-lg"
    >
      Court Connect
    </Link>
  );
}
