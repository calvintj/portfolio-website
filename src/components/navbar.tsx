"use client";
import { useEffect, useState } from "react";
import { socials } from "@/components/contact";
import ThemeToggle from "@/components/theme-toggle";
import { useContent } from "@/hooks";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

/** Jakarta wall clock; rendered after mount to avoid a hydration mismatch. */
function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time || "--:--"} WIB</span>;
}

const Navbar = () => {
  const { content } = useContent();
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="font-serif text-xl leading-none text-ink">
          {content.name}
          <span className="text-accent">.</span>
        </a>
        <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:flex">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="link-draw py-1 transition-colors hover:text-ink"
            >
              <span className="text-accent">0{i + 1}</span> {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted lg:inline">
            <LocalTime />
          </span>
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted transition-colors hover:text-accent"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
