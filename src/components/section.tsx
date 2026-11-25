"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.2, 0.7, 0.2, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

export const pad = (n: number) => String(n).padStart(2, "0");

/** Full-width hairline that draws in from the left. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease }}
      className={`h-px origin-left bg-rule ${className}`}
    />
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Editorial section: numbered header row on a hairline, then a big serif
 * title. With `aside`, the title sits in a sticky left column on desktop.
 */
export function Section({
  id,
  index,
  label,
  title,
  count,
  aside = false,
  children,
}: {
  id: string;
  index: number;
  label: string;
  title: ReactNode;
  count?: number;
  aside?: boolean;
  children: ReactNode;
}) {
  const heading = (
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="font-serif text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
    >
      {title}
    </motion.h2>
  );

  return (
    <section id={id} className="scroll-mt-20 pt-20 pb-8 lg:pt-28">
      <Container>
        <Rule />
        <div className="flex items-baseline justify-between pt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span>
            <span className="text-accent">({pad(index)})</span> {label}
          </span>
          {count !== undefined && <span>{pad(count)} entries</span>}
        </div>
        {aside ? (
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">{heading}</div>
            </div>
            <div className="lg:col-span-8">{children}</div>
          </div>
        ) : (
          <>
            <div className="mt-10">{heading}</div>
            <div className="mt-12">{children}</div>
          </>
        )}
      </Container>
    </section>
  );
}

/** Tags as a quiet, wrapping mono line. */
export function TagLine({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs leading-relaxed text-muted">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

export type TimelineEntry = {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="border-t border-rule">
      {entries.map((entry) => (
        <motion.li
          key={`${entry.year}-${entry.role}-${entry.company}`}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-3 border-b border-rule py-8 sm:grid-cols-[9rem_1fr] sm:gap-6"
        >
          <p className="pt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
            {entry.year}
          </p>
          <div>
            <h3 className="font-serif text-3xl leading-tight text-ink">
              {entry.role}
            </h3>
            <p className="mt-1 text-sm text-accent">{entry.company}</p>
            {entry.description && (
              <p className="mt-4 max-w-prose whitespace-pre-line text-[15px] leading-relaxed text-muted">
                {entry.description}
              </p>
            )}
            {entry.technologies.length > 0 && (
              <div className="mt-4">
                <TagLine tags={entry.technologies} />
              </div>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
