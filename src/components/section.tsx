"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-white/5 py-20 lg:py-24"
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mb-12"
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-teal-300">
        {label}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 lg:text-4xl">
        {title}
      </h2>
    </motion.div>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 font-mono text-xs text-zinc-400"
        >
          {tag}
        </span>
      ))}
    </div>
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
    <div className="space-y-12">
      {entries.map((entry) => (
        <motion.article
          key={`${entry.year}-${entry.role}`}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="group grid gap-2 lg:grid-cols-[180px_1fr] lg:gap-8"
        >
          <p className="pt-1 font-mono text-sm text-zinc-500">{entry.year}</p>
          <div>
            <h3 className="text-lg font-medium text-zinc-100">
              {entry.role}
              <span className="text-zinc-500"> · </span>
              <span className="text-teal-300/90">{entry.company}</span>
            </h3>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-zinc-400">
              {entry.description}
            </p>
            <TagList tags={entry.technologies} />
          </div>
        </motion.article>
      ))}
    </div>
  );
}
