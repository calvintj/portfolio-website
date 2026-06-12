"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/components/section";
import { useContent } from "@/hooks";

const Contact = () => {
  const { content } = useContent();
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-white/5 py-24"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="text-center"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-teal-300">
          Contact
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 lg:text-5xl">
          Let&apos;s build something together
        </h2>
        <p className="mt-4 text-zinc-400">
          Based in {content.contact.domicile} — open to interesting problems.
        </p>
        <a
          href={`mailto:${content.contact.email}`}
          className="mt-8 inline-block rounded-lg bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-teal-300"
        >
          {content.contact.email}
        </a>
        <p className="mt-16 font-mono text-xs text-zinc-600">
          © {new Date().getFullYear()} {content.name}
        </p>
      </motion.div>
    </section>
  );
};

export default Contact;
