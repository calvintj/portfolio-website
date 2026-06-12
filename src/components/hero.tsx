"use client";
import { motion } from "framer-motion";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import { useContent } from "@/hooks";

const stagger = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  },
});

const Hero = () => {
  const { content } = useContent();
  return (
    <section
      id="top"
      className="flex min-h-[calc(100vh-4rem)] items-center py-20"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <motion.div
            variants={stagger(0)}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
            </span>
            <span className="font-mono text-xs text-teal-300">
              Building AI products at Bati
            </span>
          </motion.div>

          <motion.h1
            variants={stagger(0.1)}
            initial="hidden"
            animate="visible"
            className="text-5xl font-semibold tracking-tight text-zinc-50 lg:text-7xl"
          >
            {content.name}
          </motion.h1>

          <motion.p
            variants={stagger(0.2)}
            initial="hidden"
            animate="visible"
            className="mt-4 font-mono text-lg text-teal-300/90"
          >
            {content.position}
          </motion.p>

          <motion.p
            variants={stagger(0.3)}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-400"
          >
            {content.heroContent}
          </motion.p>

          <motion.div
            variants={stagger(0.4)}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="/Calvin_Hendra_CV.pdf"
              download="Calvin_Hendra_CV.pdf"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-teal-300"
            >
              <FiDownload className="h-4 w-4" />
              Download CV
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
            >
              Get in touch
              <FiArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mx-auto lg:mx-0"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-teal-400/30 via-transparent to-transparent blur-sm" />
            <img
              src={content.profileImage}
              alt={content.name}
              className="relative h-64 w-64 rounded-2xl border border-white/10 object-cover lg:h-80 lg:w-80"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
