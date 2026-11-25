"use client";
import { motion } from "framer-motion";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";
import { Container, pad } from "@/components/section";
import { useContent } from "@/hooks";
import { cvHref } from "@/lib/cv";

const ease = [0.2, 0.7, 0.2, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});

/** One line of the name, sliding up out of a mask. */
function NameLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const Hero = () => {
  const { content } = useContent();
  const cv = cvHref(content.cvUrl);

  // Last word of the name gets the italic line: "Calvin / Hendra."
  const words = content.name.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : undefined;
  const first = words.join(" ");

  // First sentence of the intro is the lede; the rest reads quieter.
  const intro = content.heroContent.trim();
  const cut = intro.search(/[.!?]\s/);
  const lede = cut === -1 ? intro : intro.slice(0, cut + 1);
  const rest = cut === -1 ? "" : intro.slice(cut + 2);

  const stats = [
    { n: content.projects.length, label: "Projects shipped" },
    { n: content.experiences.length, label: "Engineering roles" },
    { n: content.certifications.length, label: "Certifications" },
  ];

  return (
    <section id="top" className="pt-10 pb-8 lg:pt-14">
      <Container>
        <motion.div
          {...rise(0)}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted"
        >
          <span>
            <span className="text-accent">(00)</span> {content.position}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Building AI products at Bati
          </span>
        </motion.div>

        <div className="mt-10 grid items-end gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <h1 className="font-serif text-[clamp(4.5rem,15vw,11rem)] leading-[0.85] tracking-[-0.02em] text-ink lg:col-span-8">
            <NameLine delay={0.1}>{first}</NameLine>
            {last && (
              <NameLine delay={0.22}>
                <em className="italic">{last}</em>
                <span className="text-accent">.</span>
              </NameLine>
            )}
          </h1>

          <motion.figure
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.1, delay: 0.35, ease }}
            className="w-full max-w-[13rem] sm:max-w-xs lg:col-span-4 lg:max-w-none lg:justify-self-end"
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-paper-2 lg:w-72">
              <img
                src={content.profileImage}
                alt={content.name}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Fig. 1 — {content.nickname}, {content.contact.domicile}
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-14 grid gap-10 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-8">
          <motion.div {...rise(0.5)} className="lg:col-span-7">
            <p className="max-w-2xl text-lg leading-snug text-ink sm:text-[1.375rem]">
              {lede} {rest && <span className="text-muted">{rest}</span>}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              {cv && (
                <a
                  href={cv}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent"
                >
                  Download CV
                  <FiArrowDown className="h-4 w-4" />
                </a>
              )}
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                <span className="link-draw">Get in touch</span>
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          <motion.dl
            {...rise(0.6)}
            className="grid grid-cols-3 gap-4 self-end sm:gap-6 lg:col-span-5 lg:col-start-8"
          >
            {stats.map((s) => (
              // dt comes first for valid markup; flex-col-reverse shows the number on top.
              // justify-end pins numbers to the top so one-line labels don't drop them lower.
              <div key={s.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-2 font-mono text-[10px] uppercase leading-snug tracking-[0.1em] text-muted sm:text-[11px] sm:tracking-[0.15em]">
                  {s.label}
                </dt>
                <dd className="font-serif text-5xl leading-none text-ink">
                  {pad(s.n)}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
