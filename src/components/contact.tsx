"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiArrowUp, FiArrowUpRight, FiCheck, FiCopy } from "react-icons/fi";
import { Container, fadeUp, pad, Rule } from "@/components/section";
import { useContent } from "@/hooks";

// Shared with the navbar, which shows the icons.
export const socials = [
  {
    href: "https://www.linkedin.com/in/calvinhendra",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  { href: "https://github.com/calvintj", label: "GitHub", Icon: FaGithub },
  {
    href: "https://www.instagram.com/calvintjj",
    label: "Instagram",
    Icon: FaInstagram,
  },
];

const Contact = ({ index }: { index: number }) => {
  const { content } = useContent();
  const { email, domicile } = content.contact;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked: the mailto link still works
    }
  };

  return (
    <footer id="contact" className="scroll-mt-20 pt-20 lg:pt-28">
      <Container>
        <Rule />
        <div className="pt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="text-accent">({pad(index)})</span> Contact
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10"
        >
          <h2 className="font-serif text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-[-0.02em] text-ink">
            Let&apos;s build something <em className="italic">together</em>
            <span className="text-accent">.</span>
          </h2>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-3 font-serif text-3xl text-ink sm:text-5xl"
            >
              <span className="link-draw break-all">{email}</span>
              <FiArrowUpRight className="h-8 w-8 shrink-0 text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              {copied ? (
                <FiCheck className="h-3.5 w-3.5" />
              ) : (
                <FiCopy className="h-3.5 w-3.5" />
              )}
              <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </motion.div>

        <div className="mt-24 grid gap-10 border-t border-rule pt-8 sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-ink"
                  >
                    <span className="link-draw">{s.label}</span>
                    <FiArrowUpRight className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Based in
            </p>
            <p className="mt-4 text-ink">{domicile}</p>
            <p className="text-muted">Open to interesting problems.</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Colophon
            </p>
            <p className="mt-4 text-muted">
              Set in Instrument Serif &amp; Geist. Built with Next.js.
            </p>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-rule py-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span>
            © {new Date().getFullYear()} {content.name}
          </span>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 hover:text-ink"
          >
            Back to top
            <FiArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Contact;
